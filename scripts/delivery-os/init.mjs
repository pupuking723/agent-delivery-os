#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
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

function buildManifest({ title, mode, reason, lang, summary }) {
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

function buildMetadata({ title, summary, project, repo, issue, mode, reason, lang, outDir }) {
  return {
    title,
    summary,
    project: project || '',
    repo: repo || '',
    issue: issue || '',
    mode,
    modeLabel: MODES[mode],
    reason,
    language: lang,
    outputDir: outDir,
    createdAt: new Date().toISOString(),
  }
}

function buildNextSteps({ mode, title, outDir }) {
  const steps = {
    flash: [
      '补齐 `idea-brief.md`，收敛核心机会、目标用户和最小范围',
      '把 `PRD.md` 和 `design-spec.md` 压缩到能支撑上线的最小深度',
      '补 `implementation-plan.md`，确认最小验证和上线路径',
      '发布前检查 `release-checklist.md`，上线后补第一条反馈',
    ],
    product: [
      '先补 `project-profile.md`，锁定项目边界、命令和发布入口',
      '在 `PRD.md` 和 `design-spec.md` 中写清本轮功能和验收标准',
      '在 `implementation-plan.md` 和 `task-breakdown.md` 中拆出可执行任务',
      '发布后将观察结果回写到 `iteration-log.md`',
    ],
    legacy: [
      '先补 `project-profile.md`，记录技术栈、命令、部署和风险模块',
      '补 `system-map.md`，把关键路径和上下游依赖梳理清楚',
      '在 `implementation-plan.md` 和 `task-breakdown.md` 中缩小本轮修改边界',
      '按 `release-checklist.md` 验证，并在需要时补上线后的 `iteration-log.md`',
    ],
  }

  return `# Next Steps

## Current Task

- Title: ${title}
- Mode: ${MODES[mode]}
- Workspace: ${outDir}

## Recommended Sequence

${steps[mode].map(step => `- [ ] ${step}`).join('\n')}

## Suggested Commands

\`\`\`bash
code "${outDir}"
\`\`\`
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

function ensureOutputDir(outDir, force) {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
    return
  }

  const entries = readdirSync(outDir)
  if (entries.length > 0 && !force) {
    console.error(`Output directory is not empty: ${outDir}`)
    console.error('Use --force to overwrite template files into an existing workspace.')
    process.exit(1)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const title = args.title || args.name
  const summary = args.summary || ''
  const lang = args.lang === 'en' ? 'en' : 'zh'
  const dryRun = Boolean(args['dry-run'])
  const force = Boolean(args.force)
  const project = args.project || ''
  const repo = args.repo || ''
  const issue = args.issue || ''

  if (!title) {
    console.error('Missing required argument: --title')
    process.exit(1)
  }

  const route = args.mode && args.mode !== 'auto'
    ? { mode: args.mode, reason: args.reason || 'explicit mode override' }
    : detectMode(`${title}\n${summary}`)

  if (!ARTIFACTS[route.mode]) {
    console.error(`Unsupported mode: ${route.mode}`)
    process.exit(1)
  }

  const slug = args.slug || slugify(title)
  const outDir = resolve(args.out || join(ROOT, 'workspace', slug))

  if (!dryRun) {
    ensureOutputDir(outDir, force)
  }

  const files = copyArtifacts({ lang, mode: route.mode, outDir, dryRun })
  const manifestPath = join(outDir, 'README.md')
  const metadataPath = join(outDir, 'kickoff.json')
  const nextStepsPath = join(outDir, 'next-steps.md')
  const metadata = buildMetadata({ title, summary, project, repo, issue, mode: route.mode, reason: route.reason, lang, outDir })

  if (!dryRun) {
    writeFileSync(manifestPath, buildManifest({ title, mode: route.mode, reason: route.reason, lang, summary }))
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    writeFileSync(nextStepsPath, buildNextSteps({ mode: route.mode, title, outDir }))
  }

  console.log(`Mode: ${MODES[route.mode]}`)
  console.log(`Reason: ${route.reason}`)
  console.log(`Output: ${outDir}`)
  console.log(`Working directory: ${cwd()}`)
  console.log('Files:')
  for (const file of [manifestPath, metadataPath, nextStepsPath, ...files]) {
    console.log(`- ${existsSync(file) || dryRun ? file : `${file} (missing)`}`)
  }
}

main()
