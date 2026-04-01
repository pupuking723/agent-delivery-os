#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const MODES = {
  flash: 'Flash Launch',
  product: 'Product Iteration',
  legacy: 'Legacy Maintenance',
}

const ARTIFACTS = {
  flash: ['idea-brief', 'PRD', 'design-spec', 'implementation-plan', 'release-checklist'],
  product: ['project-profile', 'PRD', 'design-spec', 'implementation-plan', 'task-breakdown', 'release-checklist', 'iteration-log'],
  legacy: ['project-profile', 'system-map', 'implementation-plan', 'task-breakdown', 'release-checklist'],
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

function templateRoot(lang) {
  return join(ROOT, lang === 'en' ? 'docs/templates' : 'docs/templates-zh')
}

function buildManifest({ title, mode, reason, lang, summary, outDir }) {
  return `# Delivery Kickoff

- Title: ${title}
- Mode: ${MODES[mode]}
- Reason: ${reason}
- Language: ${lang}
- Summary: ${summary || ''}

## Generated Artifacts

${ARTIFACTS[mode].map(name => `- ${name}.md`).join('\n')}
`
}

function copyArtifacts({ lang, mode, outDir, dryRun }) {
  const sourceRoot = templateRoot(lang)
  const files = []
  for (const artifact of ARTIFACTS[mode]) {
    const source = join(sourceRoot, `${artifact}.md`)
    const target = join(outDir, `${artifact}.md`)
    files.push(target)
    if (!dryRun) {
      cpSync(source, target)
    }
  }
  return files
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const title = args.title || args.name
  const summary = args.summary || ''
  const lang = args.lang === 'en' ? 'en' : 'zh'
  const dryRun = Boolean(args['dry-run'])

  if (!title) {
    console.error('Missing required argument: --title')
    process.exit(1)
  }

  const route = args.mode && args.mode !== 'auto'
    ? { mode: args.mode, reason: 'explicit mode override' }
    : detectMode(`${title}\n${summary}`)

  if (!ARTIFACTS[route.mode]) {
    console.error(`Unsupported mode: ${route.mode}`)
    process.exit(1)
  }

  const slug = args.slug || slugify(title)
  const outDir = resolve(args.out || join(ROOT, 'workspace', slug))

  if (!dryRun) {
    mkdirSync(outDir, { recursive: true })
  }

  const files = copyArtifacts({ lang, mode: route.mode, outDir, dryRun })
  const manifestPath = join(outDir, 'README.md')

  if (!dryRun) {
    writeFileSync(manifestPath, buildManifest({ title, mode: route.mode, reason: route.reason, lang, summary, outDir }))
  }

  console.log(`Mode: ${MODES[route.mode]}`)
  console.log(`Reason: ${route.reason}`)
  console.log(`Output: ${outDir}`)
  console.log('Files:')
  for (const file of [manifestPath, ...files]) {
    console.log(`- ${existsSync(file) || dryRun ? file : `${file} (missing)`}`)
  }
}

main()
