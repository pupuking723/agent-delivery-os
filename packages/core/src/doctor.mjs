import { existsSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import {
  BUSINESS_FILES,
  COMMON_FILES,
  REQUIRED_SCRIPTS,
  REQUIRED_TOPICS,
  TEMPLATE_FILES,
} from './config.mjs'
import { inferRepoFromOrigin, runProcess, toList } from './utils.mjs'

function detectKind(explicitKind) {
  if (explicitKind)
    return explicitKind
  if (existsSync('docs/project/bootstrap.json'))
    return 'business'
  if (existsSync('docs/repo/template-repo-guide.md'))
    return 'template'
  return 'generic'
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function parseLatestChangelogVersion() {
  if (!existsSync('CHANGELOG.md'))
    return ''
  const content = readFileSync('CHANGELOG.md', 'utf-8')
  const match = content.match(/^##\s+v([0-9]+\.[0-9]+\.[0-9]+)/m)
  return match?.[1] || ''
}

function addCheck(results, ok, label, detail = '') {
  results.push({ ok, label, detail })
}

function checkCommand(results, { env, label, command, args, detail }) {
  const result = runProcess(command, args, { allowFailure: true, env })
  addCheck(results, result.status === 0, label, detail || result.error || result.stderr || result.stdout)
}

function detectCommandHint(text, keywords) {
  const normalized = text.toLowerCase()
  return keywords.some(keyword => normalized.includes(keyword.toLowerCase()))
}

const SUPPORTED_TOOLCHAINS = new Set(['gh', 'vercel', 'opencli', 'playwright'])

function checkWorkspace(results, workspaceInput) {
  const workspacePath = resolve(workspaceInput)
  addCheck(results, existsSync(workspacePath), `workspace:path:${workspacePath}`)

  if (!existsSync(workspacePath))
    return null

  const requiredFiles = ['README.md', 'kickoff.json', 'next-steps.md']
  for (const file of requiredFiles)
    addCheck(results, existsSync(join(workspacePath, file)), `workspace:file:${file}`)

  const kickoffPath = join(workspacePath, 'kickoff.json')
  if (!existsSync(kickoffPath))
    return { path: workspacePath, kickoff: null, interfaceMap: '', readme: '' }

  const kickoff = loadJson(kickoffPath)
  addCheck(results, Boolean(kickoff.mode), 'workspace:kickoff:mode')
  addCheck(results, Boolean(kickoff.title), 'workspace:kickoff:title')

  const optionalArtifacts = kickoff.optionalArtifacts || []
  for (const artifact of optionalArtifacts)
    addCheck(results, existsSync(join(workspacePath, `${artifact}.md`)), `workspace:optional-artifact:${artifact}`)

  const interfaceMapPath = join(workspacePath, 'tool-interface-map.md')
  const readmePath = join(workspacePath, 'README.md')

  return {
    path: workspacePath,
    kickoff,
    interfaceMap: existsSync(interfaceMapPath) ? readFileSync(interfaceMapPath, 'utf-8') : '',
    readme: existsSync(readmePath) ? readFileSync(readmePath, 'utf-8') : '',
  }
}

function detectToolchainTargets({ repo, pkg, workspaceInfo }) {
  const scriptsText = Object.values(pkg?.scripts || {}).join('\n')
  const workspaceText = [
    workspaceInfo?.kickoff?.title || '',
    workspaceInfo?.kickoff?.summary || '',
    workspaceInfo?.kickoff?.repo || '',
    workspaceInfo?.interfaceMap || '',
    workspaceInfo?.readme || '',
  ].join('\n')
  const combinedText = `${scriptsText}\n${workspaceText}`
  const targets = new Set()

  if (repo || detectCommandHint(combinedText, ['github', 'gh ']))
    targets.add('gh')

  if (
    existsSync('vercel.json')
    || detectCommandHint(combinedText, ['vercel'])
  )
    targets.add('vercel')

  if (
    detectCommandHint(combinedText, ['opencli', 'website', 'browser', 'dashboard', 'electron', 'desktop'])
  )
    targets.add('opencli')

  if (
    existsSync('playwright.config.ts')
    || existsSync('playwright.config.js')
    || existsSync('playwright.config.mjs')
    || detectCommandHint(combinedText, ['playwright'])
  )
    targets.add('playwright')

  return [...targets]
}

function resolveToolchainTargets(args, context) {
  const explicitTargets = toList(args.toolchain || args.toolchains).map(item => item.toLowerCase())
  if (explicitTargets.length > 0) {
    const unsupported = explicitTargets.filter(item => !SUPPORTED_TOOLCHAINS.has(item))
    if (unsupported.length > 0)
      throw new Error(`Unsupported toolchain target(s): ${unsupported.join(', ')}`)
    return { mode: 'explicit', targets: [...new Set(explicitTargets)] }
  }

  const checkMode = typeof args['check-toolchain'] === 'string'
    ? args['check-toolchain'].toLowerCase()
    : 'auto'

  if (checkMode === 'all')
    return { mode: 'all', targets: ['gh', 'vercel', 'opencli', 'playwright'] }

  return {
    mode: 'auto',
    targets: detectToolchainTargets(context),
  }
}

function checkToolchain(results, env, selection) {
  addCheck(results, true, 'toolchain:scope', `${selection.mode}:${selection.targets.join(',') || 'none'}`)

  for (const target of selection.targets) {
    switch (target) {
      case 'gh':
        checkCommand(results, {
          env,
          label: 'toolchain:gh-auth',
          command: 'gh',
          args: ['auth', 'status'],
        })
        break
      case 'vercel':
        checkCommand(results, {
          env,
          label: 'toolchain:vercel-whoami',
          command: 'vercel',
          args: ['whoami'],
        })
        break
      case 'opencli':
        checkCommand(results, {
          env,
          label: 'toolchain:opencli-doctor',
          command: 'opencli',
          args: ['doctor'],
        })
        break
      case 'playwright':
        checkCommand(results, {
          env,
          label: 'toolchain:playwright',
          command: 'pnpm',
          args: ['exec', 'playwright', '--help'],
        })
        break
    }
  }
}

export function runDoctor(args) {
  const kind = detectKind(args.kind)
  const repo = args.repo || inferRepoFromOrigin()
  const skipRemote = Boolean(args['skip-remote'])
  const checkToolchainEnabled = Boolean(args['check-toolchain'] || args.toolchain || args.toolchains)
  const env = args.env || process.env
  const results = []

  for (const file of COMMON_FILES)
    addCheck(results, existsSync(file), `file:${file}`)

  if (kind === 'template') {
    for (const file of TEMPLATE_FILES)
      addCheck(results, existsSync(file), `template-file:${file}`)
  }

  if (kind === 'business') {
    for (const file of BUSINESS_FILES)
      addCheck(results, existsSync(file), `business-file:${file}`)
  }

  if (existsSync('package.json')) {
    const pkg = loadJson('package.json')
    for (const script of REQUIRED_SCRIPTS)
      addCheck(results, Boolean(pkg.scripts?.[script]), `script:${script}`)

    const changelogVersion = parseLatestChangelogVersion()
    if (changelogVersion)
      addCheck(results, pkg.version === changelogVersion, 'version:package-vs-changelog', `package=${pkg.version}, changelog=${changelogVersion}`)
  }
  else {
    addCheck(results, false, 'file:package.json')
  }

  if (kind === 'business' && existsSync('docs/project/bootstrap.json')) {
    const bootstrap = loadJson('docs/project/bootstrap.json')
    const workspaceRoot = bootstrap.workspaceRoot || ''
    addCheck(results, Boolean(workspaceRoot), 'business:workspace-root')
    if (workspaceRoot)
      addCheck(results, existsSync(workspaceRoot), `business:workspace-dir:${workspaceRoot}`)
  }

  let workspaceInfo = null
  if (args.workspace)
    workspaceInfo = checkWorkspace(results, args.workspace)

  if (checkToolchainEnabled) {
    const selection = resolveToolchainTargets(args, {
      repo,
      pkg: existsSync('package.json') ? loadJson('package.json') : null,
      workspaceInfo,
    })
    checkToolchain(results, env, selection)
  }

  if (!skipRemote && repo) {
    const repoView = runProcess('gh', ['repo', 'view', repo, '--json', 'isTemplate,homepageUrl,repositoryTopics,description'], { allowFailure: true })
    addCheck(results, repoView.status === 0, 'remote:repo-view', repo)

    if (repoView.status === 0) {
      const payload = JSON.parse(repoView.stdout)
      const topics = (payload.repositoryTopics || []).map(item => item.name)
      addCheck(results, Boolean(payload.description), 'remote:description')
      addCheck(results, Boolean(payload.homepageUrl), 'remote:homepage')
      for (const topic of REQUIRED_TOPICS)
        addCheck(results, topics.includes(topic), `remote:topic:${topic}`)
      if (kind === 'template')
        addCheck(results, payload.isTemplate === true, 'remote:is-template')
    }

    const labels = runProcess('gh', ['label', 'list', '--repo', repo, '--limit', '200', '--json', 'name'], { allowFailure: true })
    addCheck(results, labels.status === 0, 'remote:labels-list')
    if (labels.status === 0) {
      const payload = JSON.parse(labels.stdout)
      const names = payload.map(item => item.name)
      for (const label of ['flash-launch', 'product-iteration', 'legacy-maintenance'])
        addCheck(results, names.includes(label), `remote:label:${label}`)
    }
  }
  else {
    addCheck(results, true, 'remote:skipped', repo ? 'requested by flag' : 'no origin repo detected')
  }

  return {
    kind,
    repo: repo || 'local-only',
    results,
  }
}

export function printDoctorReport(report) {
  console.log(`Doctor kind: ${report.kind}`)
  console.log(`Repository: ${report.repo}`)
  const toolchainChecks = report.results.filter(item => item.label.startsWith('toolchain:'))
  if (toolchainChecks.length > 0) {
    console.log('Toolchain:')
    for (const item of toolchainChecks) {
      const prefix = item.ok ? 'PASS' : 'FAIL'
      const detail = item.detail ? ` - ${item.detail}` : ''
      console.log(`${prefix} ${item.label}${detail}`)
    }
  }
  for (const item of report.results) {
    if (item.label.startsWith('toolchain:'))
      continue
    const prefix = item.ok ? 'PASS' : 'FAIL'
    const detail = item.detail ? ` - ${item.detail}` : ''
    console.log(`${prefix} ${item.label}${detail}`)
  }

  const failed = report.results.filter(item => !item.ok)
  if (failed.length > 0)
    throw new Error(`Doctor failed with ${failed.length} check(s).`)

  console.log('Doctor passed.')
}
