#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const INIT_SCRIPT = join(ROOT, 'scripts', 'delivery-os', 'init.mjs')

const MODE_LABELS = new Set(['flash-launch', 'product-iteration', 'legacy-maintenance'])
const MODE_MAP = {
  'flash-launch': 'flash',
  'product-iteration': 'product',
  'legacy-maintenance': 'legacy',
}

const MODE_KEYWORDS = {
  legacy: ['legacy', 'old project', 'handoff', 'vibe', 'maintenance', '接手', '老项目', '历史代码', '文档缺失', '维护'],
  flash: ['mvp', 'launch', 'idea', 'fast', 'validate', '抢市场', '快速上线', '验证想法', '最小可用'],
  product: ['iteration', 'feature', 'optimize', 'feedback', 'conversion', '新增功能', '新增', '优化', '迭代', '下一版本', '已上线', '上线产品'],
}

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

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'delivery-task'
}

function workspaceSlug(issue) {
  const base = slugify(issue.title || '')
  const prefix = issue.number ? `${issue.number}-` : ''
  return `${prefix}${base}`
}

function detectMode(text) {
  const normalized = text.toLowerCase()
  for (const keyword of MODE_KEYWORDS.legacy) {
    if (normalized.includes(keyword.toLowerCase()))
      return { mode: 'legacy', reason: `matched legacy keyword: ${keyword}` }
  }
  for (const keyword of MODE_KEYWORDS.flash) {
    if (normalized.includes(keyword.toLowerCase()))
      return { mode: 'flash', reason: `matched flash keyword: ${keyword}` }
  }
  for (const keyword of MODE_KEYWORDS.product) {
    if (normalized.includes(keyword.toLowerCase()))
      return { mode: 'product', reason: `matched product keyword: ${keyword}` }
  }
  return { mode: 'legacy', reason: 'defaulted to the highest-risk safe mode' }
}

function extractProject(body, fallback) {
  const lines = body.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim()
    if (line.includes('项目名') || /^project$/i.test(line)) {
      const next = lines[i + 1]?.trim()
      if (next)
        return next.replace(/^-+\s*/, '')
    }
  }
  return fallback
}

function summarizeBody(body) {
  return body
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 8)
    .join('；')
}

function loadIssueFromFile(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function loadIssueFromGitHub(repo, issue) {
  const result = spawnSync('gh', [
    'issue',
    'view',
    issue,
    '--repo',
    repo,
    '--json',
    'title,body,labels,number,url',
  ], { encoding: 'utf-8' })

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout)
    process.exit(result.status ?? 1)
  }

  return JSON.parse(result.stdout)
}

function resolveMode(issue) {
  const labelNames = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name)
  const explicitLabel = labelNames.find(label => MODE_LABELS.has(label))
  if (explicitLabel) {
    return { mode: MODE_MAP[explicitLabel], reason: `matched issue label: ${explicitLabel}` }
  }

  return detectMode(`${issue.title}\n${issue.body || ''}`)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const issue = args.file
    ? loadIssueFromFile(args.file)
    : loadIssueFromGitHub(args.repo, args.issue)

  if (!issue?.title) {
    console.error('Issue payload is missing title')
    process.exit(1)
  }

  const route = resolveMode(issue)
  const project = args.project || extractProject(issue.body || '', args.repo?.split('/')?.[1] || '')
  const summary = args.summary || summarizeBody(issue.body || issue.title)
  const outDir = resolve(args.out || join(ROOT, 'workspace', workspaceSlug(issue)))

  const initArgs = [
    INIT_SCRIPT,
    '--title', issue.title,
    '--summary', summary,
    '--mode', route.mode,
    '--reason', route.reason,
    '--project', project,
    '--repo', args.repo || '',
    '--issue', String(issue.number || args.issue || ''),
    '--out', outDir,
  ]

  if (args.lang)
    initArgs.push('--lang', args.lang)
  if (args.force)
    initArgs.push('--force')
  if (args['dry-run'])
    initArgs.push('--dry-run')

  const result = spawnSync('node', initArgs, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  if (!args['dry-run']) {
    writeFileSync(join(outDir, 'issue-source.json'), `${JSON.stringify(issue, null, 2)}\n`)
  }

  console.log(`Source issue: ${issue.url || 'local file'}`)
  console.log(`Resolved mode: ${route.mode}`)
  console.log(`Reason: ${route.reason}`)
}

main()
