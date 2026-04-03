import { existsSync, readFileSync } from 'node:fs'
import {
  BUSINESS_FILES,
  COMMON_FILES,
  REQUIRED_SCRIPTS,
  REQUIRED_TOPICS,
  TEMPLATE_FILES,
} from './config.mjs'
import { inferRepoFromOrigin, runProcess } from './utils.mjs'

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

export function runDoctor(args) {
  const kind = detectKind(args.kind)
  const repo = args.repo || inferRepoFromOrigin()
  const skipRemote = Boolean(args['skip-remote'])
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
  for (const item of report.results) {
    const prefix = item.ok ? 'PASS' : 'FAIL'
    const detail = item.detail ? ` - ${item.detail}` : ''
    console.log(`${prefix} ${item.label}${detail}`)
  }

  const failed = report.results.filter(item => !item.ok)
  if (failed.length > 0)
    throw new Error(`Doctor failed with ${failed.length} check(s).`)

  console.log('Doctor passed.')
}
