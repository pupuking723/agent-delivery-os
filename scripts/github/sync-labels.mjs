#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

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

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const repo = args.repo

  if (!repo) {
    console.error('Missing required argument: --repo <owner/name>')
    process.exit(1)
  }

  const labelsPath = join(ROOT, '.github', 'labels.json')
  const labels = JSON.parse(readFileSync(labelsPath, 'utf-8'))

  for (const label of labels) {
    run('gh', [
      'label',
      'create',
      label.name,
      '--repo',
      repo,
      '--color',
      label.color,
      '--description',
      label.description,
      '--force',
    ])
  }
}

main()
