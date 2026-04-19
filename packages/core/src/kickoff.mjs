import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import { ARTIFACTS, INTERFACE_MAP_KEYWORDS, MODES, MODE_KEYWORDS, MODE_LABELS, MODE_MAP, OPTIONAL_ARTIFACTS, ROOT } from './config.mjs'
import { runProcess, slugify } from './utils.mjs'

export function detectMode(text) {
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

function buildManifest({ title, mode, reason, lang, summary, artifacts }) {
  return `# Delivery Kickoff

- Title: ${title}
- Mode: ${MODES[mode]}
- Reason: ${reason}
- Language: ${lang}
- Summary: ${summary || ''}

## Generated Artifacts

${artifacts.map(name => `- ${name}.md`).join('\n')}
`
}

function buildMetadata({ title, summary, project, repo, issue, mode, reason, lang, outDir, optionalArtifacts, optionalArtifactReasons }) {
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
    optionalArtifacts,
    optionalArtifactReasons,
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

function ensureOutputDir(outDir, force) {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
    return
  }

  const entries = readdirSync(outDir)
  if (entries.length > 0 && !force)
    throw new Error(`Output directory is not empty: ${outDir}`)
}

function copyArtifacts({ lang, mode, outDir, dryRun }) {
  const sourceRoot = templateRoot(lang)
  const artifactNames = Array.from(new Set(mode))
  const files = []
  for (const artifact of artifactNames) {
    const source = join(sourceRoot, `${artifact}.md`)
    const target = join(outDir, `${artifact}.md`)
    files.push(target)
    if (!dryRun)
      cpSync(source, target)
  }
  return files
}

function detectInterfaceMapReason(text) {
  const normalized = text.toLowerCase()
  for (const keyword of INTERFACE_MAP_KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase()))
      return `matched interface keyword: ${keyword}`
  }
  return ''
}

function resolveOptionalArtifacts(args, detectionText) {
  const extras = []
  const reasons = {}

  if (args['without-interface-map'])
    return { optionalArtifacts: extras, optionalArtifactReasons: reasons }

  if (args['with-interface-map']) {
    extras.push('tool-interface-map')
    reasons['tool-interface-map'] = 'explicit flag'
    return { optionalArtifacts: extras.filter(name => OPTIONAL_ARTIFACTS.includes(name)), optionalArtifactReasons: reasons }
  }

  const interfaceMapReason = detectInterfaceMapReason(detectionText)
  if (interfaceMapReason) {
    extras.push('tool-interface-map')
    reasons['tool-interface-map'] = interfaceMapReason
  }

  return {
    optionalArtifacts: extras.filter(name => OPTIONAL_ARTIFACTS.includes(name)),
    optionalArtifactReasons: reasons,
  }
}

export function createWorkspace(args) {
  const title = args.title || args.name
  if (!title)
    throw new Error('Missing required argument: --title')

  const summary = args.summary || ''
  const lang = args.lang === 'en' ? 'en' : 'zh'
  const dryRun = Boolean(args['dry-run'])
  const force = Boolean(args.force)
  const detectionText = args['detection-text'] || `${title}\n${summary}`
  const route = args.mode && args.mode !== 'auto'
    ? { mode: args.mode, reason: args.reason || 'explicit mode override' }
    : detectMode(detectionText)

  if (!ARTIFACTS[route.mode])
    throw new Error(`Unsupported mode: ${route.mode}`)

  const { optionalArtifacts, optionalArtifactReasons } = resolveOptionalArtifacts(args, detectionText)
  const artifactNames = [...ARTIFACTS[route.mode], ...optionalArtifacts]
  const slug = args.slug || slugify(title)
  const outDir = resolve(args.out || join(ROOT, 'workspace', slug))

  if (!dryRun)
    ensureOutputDir(outDir, force)

  const files = copyArtifacts({ lang, mode: artifactNames, outDir, dryRun })
  const manifestPath = join(outDir, 'README.md')
  const metadataPath = join(outDir, 'kickoff.json')
  const nextStepsPath = join(outDir, 'next-steps.md')

  if (!dryRun) {
    const metadata = buildMetadata({
      title,
      summary,
      project: args.project || '',
      repo: args.repo || '',
      issue: args.issue || '',
      mode: route.mode,
      reason: route.reason,
      lang,
      outDir,
      optionalArtifacts,
      optionalArtifactReasons,
    })
    writeFileSync(manifestPath, buildManifest({ title, mode: route.mode, reason: route.reason, lang, summary, artifacts: artifactNames }))
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    writeFileSync(nextStepsPath, buildNextSteps({ mode: route.mode, title, outDir }))
  }

  return {
    route,
    outDir,
    workingDirectory: cwd(),
    optionalArtifacts,
    optionalArtifactReasons,
    files: [manifestPath, metadataPath, nextStepsPath, ...files],
  }
}

export function printWorkspaceResult(result) {
  console.log(`Mode: ${MODES[result.route.mode]}`)
  console.log(`Reason: ${result.route.reason}`)
  console.log(`Output: ${result.outDir}`)
  console.log(`Working directory: ${result.workingDirectory}`)
  if (result.optionalArtifacts.length > 0) {
    console.log('Optional artifacts:')
    for (const artifact of result.optionalArtifacts) {
      const reason = result.optionalArtifactReasons?.[artifact]
      console.log(`- ${artifact}${reason ? ` (${reason})` : ''}`)
    }
  }
  console.log('Files:')
  for (const file of result.files)
    console.log(`- ${file}`)
}

function workspaceSlug(issue) {
  const base = slugify(issue.title || '')
  const prefix = issue.number ? `${issue.number}-` : ''
  return `${prefix}${base}`
}

function extractField(body, aliases, fallback = '') {
  const lines = body.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim()
    if (aliases.some(alias => line === alias || line === `### ${alias}` || line.includes(alias))) {
      for (let j = i + 1; j < lines.length; j += 1) {
        const next = lines[j]?.trim()
        if (!next || next.startsWith('### '))
          continue
        return next.replace(/^-+\s*/, '')
      }
    }
  }
  return fallback
}

function sanitizeWorkspaceRoot(input) {
  const root = (input || '').trim().replace(/^\.?\//, '').replace(/\/+$/g, '')
  return root || 'workspace'
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
  const result = runProcess('gh', [
    'issue',
    'view',
    issue,
    '--repo',
    repo,
    '--json',
    'title,body,labels,number,url',
  ])
  return JSON.parse(result.stdout)
}

function resolveMode(issue) {
  const labelNames = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name)
  const explicitLabel = labelNames.find(label => MODE_LABELS.has(label))
  if (explicitLabel)
    return { mode: MODE_MAP[explicitLabel], reason: `matched issue label: ${explicitLabel}` }
  return detectMode(`${issue.title}\n${issue.body || ''}`)
}

export function createWorkspaceFromIssue(args) {
  const issue = args.file
    ? loadIssueFromFile(args.file)
    : loadIssueFromGitHub(args.repo, args.issue)

  if (!issue?.title)
    throw new Error('Issue payload is missing title')

  const route = resolveMode(issue)
  const project = args.project || extractField(issue.body || '', ['项目代号', '项目名', 'project'], args.repo?.split('/')?.[1] || '')
  const workspaceRoot = sanitizeWorkspaceRoot(args['workspace-root'] || extractField(issue.body || '', ['Workspace 根目录', 'workspace root'], 'workspace'))
  const summary = args.summary || summarizeBody(issue.body || issue.title)
  const outDir = resolve(args.out || join(ROOT, workspaceRoot, workspaceSlug(issue)))
  const result = createWorkspace({
    ...args,
    title: issue.title,
    summary,
    'detection-text': `${issue.title}\n${issue.body || ''}`,
    mode: route.mode,
    reason: route.reason,
    project,
    repo: args.repo || '',
    issue: String(issue.number || args.issue || ''),
    out: outDir,
  })

  if (!args['dry-run'])
    writeFileSync(join(outDir, 'issue-source.json'), `${JSON.stringify(issue, null, 2)}\n`)

  return {
    ...result,
    sourceIssue: issue.url || 'local file',
  }
}

export function printWorkspaceFromIssueResult(result) {
  printWorkspaceResult(result)
  console.log(`Source issue: ${result.sourceIssue}`)
  console.log(`Resolved mode: ${result.route.mode}`)
  console.log(`Reason: ${result.route.reason}`)
}
