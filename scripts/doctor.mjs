#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const COMMON_FILES = [
  'README.md',
  'README.en.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'SECURITY.md',
  'SUPPORT.md',
  'CODE_OF_CONDUCT.md',
  '.github/labels.json',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/workflows/delivery-os-guardrails.yml',
  '.github/ISSUE_TEMPLATE/flash-launch.yml',
  '.github/ISSUE_TEMPLATE/product-iteration.yml',
  '.github/ISSUE_TEMPLATE/legacy-maintenance.yml',
  'docs/playbook.md',
]

const TEMPLATE_FILES = [
  'docs/repo/template-repo-guide.md',
  'docs/repo/github-setup.md',
  'scripts/bootstrap-all.mjs',
  'scripts/delivery-os/bootstrap-repo.mjs',
  'scripts/github/bootstrap-repo.mjs',
]

const BUSINESS_FILES = [
  'docs/project/README.md',
  'docs/project/bootstrap.json',
  'docs/project/project-profile.md',
  'docs/project/system-map.md',
  'docs/project/iteration-log.md',
]

const REQUIRED_SCRIPTS = [
  'bootstrap:all',
  'bootstrap:repo',
  'bootstrap:github',
  'health:check',
  'kickoff',
  'kickoff:issue',
  'labels:sync',
  'doctor',
]

const REQUIRED_TOPICS = [
  'ai-agents',
  'workflow-automation',
  'product-development',
  'developer-tools',
]

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--'))
      continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[key] = true
      continue
    }
    args[key] = next
    i += 1
  }
  return args
}

function inferRepo() {
  const result = spawnSync('git', ['config', '--get', 'remote.origin.url'], { encoding: 'utf-8' })
  if (result.status !== 0)
    return ''
  const origin = result.stdout.trim()
  const match = origin.match(/github\.com[:/](.+?)(?:\.git)?$/)
  return match?.[1] || ''
}

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

function runGh(args) {
  const result = spawnSync('gh', args, { encoding: 'utf-8' })
  if (result.status !== 0)
    return { ok: false, stdout: result.stdout, stderr: result.stderr }
  return { ok: true, stdout: result.stdout }
}

function addCheck(results, ok, label, detail = '') {
  results.push({ ok, label, detail })
}

function printResults(results) {
  for (const item of results) {
    const prefix = item.ok ? 'PASS' : 'FAIL'
    const detail = item.detail ? ` - ${item.detail}` : ''
    console.log(`${prefix} ${item.label}${detail}`)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const kind = detectKind(args.kind)
  const repo = args.repo || inferRepo()
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
    const repoView = runGh(['repo', 'view', repo, '--json', 'isTemplate,homepageUrl,repositoryTopics,description'])
    addCheck(results, repoView.ok, 'remote:repo-view', repo)

    if (repoView.ok) {
      const payload = JSON.parse(repoView.stdout)
      const topics = (payload.repositoryTopics || []).map(item => item.name)
      addCheck(results, Boolean(payload.description), 'remote:description')
      addCheck(results, Boolean(payload.homepageUrl), 'remote:homepage')
      for (const topic of REQUIRED_TOPICS)
        addCheck(results, topics.includes(topic), `remote:topic:${topic}`)
      if (kind === 'template')
        addCheck(results, payload.isTemplate === true, 'remote:is-template')
    }

    const labels = runGh(['label', 'list', '--repo', repo, '--limit', '200', '--json', 'name'])
    addCheck(results, labels.ok, 'remote:labels-list')
    if (labels.ok) {
      const payload = JSON.parse(labels.stdout)
      const names = payload.map(item => item.name)
      for (const label of ['flash-launch', 'product-iteration', 'legacy-maintenance'])
        addCheck(results, names.includes(label), `remote:label:${label}`)
    }
  }
  else {
    addCheck(results, true, 'remote:skipped', repo ? 'requested by flag' : 'no origin repo detected')
  }

  console.log(`Doctor kind: ${kind}`)
  console.log(`Repository: ${repo || 'local-only'}`)
  printResults(results)

  const failed = results.filter(item => !item.ok)
  if (failed.length > 0) {
    console.error(`Doctor failed with ${failed.length} check(s).`)
    process.exit(1)
  }

  console.log('Doctor passed.')
}

main()
