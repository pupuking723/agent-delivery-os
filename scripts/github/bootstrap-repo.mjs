#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const DEFAULT_TOPICS = [
  'delivery-os',
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
    if (args[key]) {
      const current = Array.isArray(args[key]) ? args[key] : [args[key]]
      current.push(next)
      args[key] = current
    }
    else {
      args[key] = next
    }
    i += 1
  }
  return args
}

function toList(value, fallback = []) {
  if (!value)
    return [...fallback]
  const items = Array.isArray(value) ? value : [value]
  return items
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean)
}

function run(command, args, dryRun = false) {
  const printable = [command, ...args].join(' ')
  if (dryRun) {
    console.log(`[dry-run] ${printable}`)
    return ''
  }

  const result = spawnSync(command, args, { encoding: 'utf-8' })
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout)
    process.exit(result.status ?? 1)
  }
  return result.stdout.trim()
}

function inferRepoFromOrigin() {
  const origin = run('git', ['config', '--get', 'remote.origin.url'])
  const match = origin.match(/github\.com[:/](.+?)(?:\.git)?$/)
  return match?.[1] || ''
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const dryRun = Boolean(args['dry-run'])
  const repo = args.repo || inferRepoFromOrigin()

  if (!repo) {
    console.error('Missing repository. Use --repo <owner/name> or configure remote.origin.url.')
    process.exit(1)
  }

  const project = args.project || repo.split('/')[1] || 'new-product-repo'
  const description = args.description || `Delivery OS-enabled repository for ${project}.`
  const homepage = args.homepage || `https://github.com/${repo}/blob/main/docs/playbook.md`
  const topics = toList(args.topic || args.topics, DEFAULT_TOPICS)
  const syncLabels = !args['skip-labels']

  const editArgs = [
    'repo',
    'edit',
    repo,
    '--description',
    description,
    '--homepage',
    homepage,
    '--enable-issues',
  ]

  for (const topic of topics)
    editArgs.push('--add-topic', topic)

  run('gh', editArgs, dryRun)

  if (syncLabels) {
    run('node', ['scripts/github/sync-labels.mjs', '--repo', repo], dryRun)
  }

  console.log(`Repository: ${repo}`)
  console.log(`Description: ${description}`)
  console.log(`Homepage: ${homepage}`)
  console.log(`Topics: ${topics.join(', ')}`)
  console.log(`Labels synced: ${syncLabels ? 'yes' : 'no'}`)
}

main()
