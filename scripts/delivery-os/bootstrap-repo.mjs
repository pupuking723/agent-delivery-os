#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const PROJECT_ARTIFACTS = ['project-profile', 'system-map', 'iteration-log']

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
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'project'
}

function templateRoot(lang) {
  return join(ROOT, lang === 'en' ? 'docs/templates' : 'docs/templates-zh')
}

function ensureDirectory(path, force) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
    return
  }

  const entries = readdirSync(path)
  if (entries.length > 0 && !force) {
    console.error(`Directory is not empty: ${path}`)
    console.error('Use --force to write bootstrap files into an existing project directory.')
    process.exit(1)
  }
}

function buildProjectReadme({ projectName, repoName, workspaceRoot, lang }) {
  if (lang === 'en') {
    return `# Project Context

- Project: ${projectName}
- Repository: ${repoName}
- Workspace root: ${workspaceRoot}

## Included Files

- project-profile.md
- system-map.md
- iteration-log.md
- bootstrap.json

## Next Steps

- fill in project-profile.md with stack, commands, environments, and release paths
- map the current product or system in system-map.md
- keep iteration-log.md updated after each shipped change
- use \`pnpm kickoff\` or \`pnpm kickoff:issue\` to create feature workspaces
`
  }

  return `# 项目上下文

- 项目名：${projectName}
- 仓库名：${repoName}
- Workspace 根目录：${workspaceRoot}

## 已生成文件

- project-profile.md
- system-map.md
- iteration-log.md
- bootstrap.json

## 下一步

- 在 project-profile.md 里补齐技术栈、命令、环境和发布入口
- 在 system-map.md 里梳理当前系统结构和关键路径
- 每次发布或迭代后把结果回写到 iteration-log.md
- 后续需求使用 \`pnpm kickoff\` 或 \`pnpm kickoff:issue\` 生成 feature workspace
`
}

function buildMetadata({ projectName, repoName, workspaceRoot, lang, docsDir }) {
  return {
    projectName,
    repoName,
    workspaceRoot,
    language: lang,
    docsProjectDir: docsDir,
    createdAt: new Date().toISOString(),
  }
}

function resolveRepoRoot(args) {
  if (args.root)
    return resolve(args.root)
  if (args.out)
    return resolve(args.out, '..', '..')
  return ROOT
}

function copyProjectArtifacts({ lang, docsProjectDir, dryRun }) {
  const root = templateRoot(lang)
  const files = []
  for (const artifact of PROJECT_ARTIFACTS) {
    const source = join(root, `${artifact}.md`)
    const target = join(docsProjectDir, `${artifact}.md`)
    files.push(target)
    if (!dryRun)
      cpSync(source, target)
  }
  return files
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const lang = args.lang === 'en' ? 'en' : 'zh'
  const dryRun = Boolean(args['dry-run'])
  const force = Boolean(args.force)
  const repoName = args['repo-name'] || slugify(args.project || '').replace(/-+/g, '-') || 'new-product-repo'
  const projectName = args.project || args['project-name'] || repoName
  const workspaceRoot = (args['workspace-root'] || 'workspace').replace(/\/+$/g, '') || 'workspace'
  const repoRoot = resolveRepoRoot(args)
  const docsProjectDir = resolve(args.out || join(repoRoot, 'docs', 'project'))
  const workspaceDir = resolve(join(repoRoot, workspaceRoot))

  if (!projectName) {
    console.error('Missing required argument: --project')
    process.exit(1)
  }

  if (!dryRun) {
    ensureDirectory(docsProjectDir, force)
    if (!existsSync(workspaceDir))
      mkdirSync(workspaceDir, { recursive: true })
  }

  const files = copyProjectArtifacts({ lang, docsProjectDir, dryRun })
  const readmePath = join(docsProjectDir, 'README.md')
  const metadataPath = join(docsProjectDir, 'bootstrap.json')
  const gitkeepPath = join(workspaceDir, '.gitkeep')
  const metadata = buildMetadata({ projectName, repoName, workspaceRoot, lang, docsDir: docsProjectDir })

  if (!dryRun) {
    writeFileSync(readmePath, buildProjectReadme({ projectName, repoName, workspaceRoot, lang }))
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    writeFileSync(gitkeepPath, '')
  }

  console.log(`Project: ${projectName}`)
  console.log(`Repository: ${repoName}`)
  console.log(`Docs project dir: ${docsProjectDir}`)
  console.log(`Workspace root: ${workspaceDir}`)
  console.log(`Working directory: ${cwd()}`)
  console.log('Files:')
  for (const file of [readmePath, metadataPath, ...files, gitkeepPath]) {
    console.log(`- ${existsSync(file) || dryRun ? file : `${file} (missing)`}`)
  }
}

main()
