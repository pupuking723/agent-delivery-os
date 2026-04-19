import { spawnSync } from 'node:child_process'

export function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--')
      continue
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

export function toList(value, fallback = []) {
  if (!value)
    return [...fallback]
  const items = Array.isArray(value) ? value : [value]
  return items
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean)
}

export function slugify(input) {
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'delivery-task'
}

export function runProcess(command, args, options = {}) {
  const {
    dryRun = false,
    inherit = false,
    allowFailure = false,
    cwd,
    env,
  } = options
  const printable = [command, ...args].join(' ')

  if (dryRun) {
    console.log(`[dry-run] ${printable}`)
    return { status: 0, stdout: '', stderr: '' }
  }

  const result = spawnSync(command, args, {
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: 'utf-8',
    cwd,
    env,
  })

  const status = result.status ?? (result.error ? 1 : 0)

  if (status !== 0 && !allowFailure) {
    const message = result.stderr || result.stdout || result.error?.message || `${command} exited with ${status}`
    throw new Error(message)
  }

  return {
    status,
    stdout: result.stdout?.trim() || '',
    stderr: result.stderr?.trim() || '',
    error: result.error?.message || '',
  }
}

export function inferRepoFromOrigin() {
  const result = runProcess('git', ['config', '--get', 'remote.origin.url'], { allowFailure: true })
  if (result.status !== 0)
    return ''
  const match = result.stdout.match(/github\.com[:/](.+?)(?:\.git)?$/)
  return match?.[1] || ''
}
