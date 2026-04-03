#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

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

function toArgv(args) {
  const argv = []
  for (const [key, value] of Object.entries(args)) {
    if (value === false || value == null)
      continue
    if (value === true) {
      argv.push(`--${key}`)
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        argv.push(`--${key}`, String(item))
      }
      continue
    }
    argv.push(`--${key}`, String(value))
  }
  return argv
}

function run(label, script, args) {
  const result = spawnSync('node', [script, ...toArgv(args)], {
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    console.error(`${label} failed`)
    process.exit(result.status ?? 1)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const skipRepo = Boolean(args['skip-repo'])
  const skipGitHub = Boolean(args['skip-github'])

  if (skipRepo && skipGitHub) {
    console.error('Nothing to do: both --skip-repo and --skip-github were provided.')
    process.exit(1)
  }

  const forwarded = { ...args }
  delete forwarded['skip-repo']
  delete forwarded['skip-github']

  if (!skipRepo)
    run('bootstrap:repo', 'scripts/delivery-os/bootstrap-repo.mjs', forwarded)

  if (!skipGitHub)
    run('bootstrap:github', 'scripts/github/bootstrap-repo.mjs', forwarded)
}

main()
