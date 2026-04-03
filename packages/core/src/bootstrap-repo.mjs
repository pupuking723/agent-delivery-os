import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import { PROJECT_ARTIFACTS, ROOT } from './config.mjs'
import { slugify } from './utils.mjs'

function templateRoot(lang) {
  return join(ROOT, lang === 'en' ? 'docs/templates' : 'docs/templates-zh')
}

function ensureDirectory(path, force) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
    return
  }

  const entries = readdirSync(path)
  if (entries.length > 0 && !force)
    throw new Error(`Directory is not empty: ${path}`)
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

export function createProjectBootstrap(args) {
  const lang = args.lang === 'en' ? 'en' : 'zh'
  const dryRun = Boolean(args['dry-run'])
  const force = Boolean(args.force)
  const repoName = args['repo-name'] || slugify(args.project || '').replace(/-+/g, '-') || 'new-product-repo'
  const projectName = args.project || args['project-name'] || repoName
  const workspaceRoot = (args['workspace-root'] || 'workspace').replace(/\/+$/g, '') || 'workspace'
  const repoRoot = resolveRepoRoot(args)
  const docsProjectDir = resolve(args.out || join(repoRoot, 'docs', 'project'))
  const workspaceDir = resolve(join(repoRoot, workspaceRoot))

  if (!projectName)
    throw new Error('Missing required argument: --project')

  if (!dryRun) {
    ensureDirectory(docsProjectDir, force)
    if (!existsSync(workspaceDir))
      mkdirSync(workspaceDir, { recursive: true })
  }

  const files = copyProjectArtifacts({ lang, docsProjectDir, dryRun })
  const readmePath = join(docsProjectDir, 'README.md')
  const metadataPath = join(docsProjectDir, 'bootstrap.json')
  const gitkeepPath = join(workspaceDir, '.gitkeep')

  if (!dryRun) {
    const metadata = buildMetadata({ projectName, repoName, workspaceRoot, lang, docsDir: docsProjectDir })
    writeFileSync(readmePath, buildProjectReadme({ projectName, repoName, workspaceRoot, lang }))
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    writeFileSync(gitkeepPath, '')
  }

  return {
    projectName,
    repoName,
    docsProjectDir,
    workspaceDir,
    workingDirectory: cwd(),
    files: [readmePath, metadataPath, ...files, gitkeepPath],
  }
}

export function printProjectBootstrapResult(result) {
  console.log(`Project: ${result.projectName}`)
  console.log(`Repository: ${result.repoName}`)
  console.log(`Docs project dir: ${result.docsProjectDir}`)
  console.log(`Workspace root: ${result.workspaceDir}`)
  console.log(`Working directory: ${result.workingDirectory}`)
  console.log('Files:')
  for (const file of result.files)
    console.log(`- ${file}`)
}
