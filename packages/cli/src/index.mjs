import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { runBootstrapAll } from '../../core/src/bootstrap-all.mjs'
import { createProjectBootstrap, printProjectBootstrapResult } from '../../core/src/bootstrap-repo.mjs'
import { printDoctorReport, runDoctor } from '../../core/src/doctor.mjs'
import { bootstrapGitHubRepo, printBootstrapGitHubResult, printSyncLabelsResult, syncLabels } from '../../core/src/github.mjs'
import { createWorkspace, createWorkspaceFromIssue, printWorkspaceFromIssueResult, printWorkspaceResult } from '../../core/src/kickoff.mjs'
import { inferRepoFromOrigin, parseArgs, runProcess } from '../../core/src/utils.mjs'

const RECIPE_PRESETS = {
  'official-cli': {
    name: 'official-cli',
    label: 'Official CLI',
    mode: 'product',
    withInterfaceMap: false,
    title: 'Official CLI delivery workflow',
    summary: 'Use mature official CLIs such as gh, vercel, docker, and playwright to ship a request.',
    docPath: 'docs/recipes/official-cli-delivery.md',
  },
  opencli: {
    name: 'opencli',
    label: 'OpenCLI Automation',
    mode: 'legacy',
    withInterfaceMap: true,
    title: 'OpenCLI automation workflow',
    summary: 'Use browser-driven or desktop-driven actions to automate a website, Electron app, or external tool.',
    docPath: 'docs/recipes/opencli-automation.md',
  },
  'cli-anything': {
    name: 'cli-anything',
    label: 'CLI-Anything Adapter',
    mode: 'legacy',
    withInterfaceMap: true,
    title: 'CLI-Anything adapter workflow',
    summary: 'Create a repeatable command surface for a source-available tool without a mature CLI.',
    docPath: 'docs/recipes/cli-anything-adapter.md',
  },
}

const RECIPE_KEYWORDS = {
  opencli: [
    'opencli',
    'website',
    'web app',
    'browser',
    'dashboard',
    'admin panel',
    'admin console',
    'electron',
    'desktop app',
    'desktop tool',
    '网站',
    '网页',
    '浏览器',
    '后台',
    '管理后台',
    '桌面应用',
    '桌面工具',
  ],
  'cli-anything': [
    'cli-anything',
    'source-available',
    'open source',
    'internal tool',
    'adapter',
    'automation adapter',
    '源码可用',
    '开源项目',
    '内部工具',
    '适配器',
  ],
}

function readJsonIfExists(path) {
  if (!existsSync(path))
    return null
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function detectKeyword(keywordSets, text) {
  const normalized = text.toLowerCase()
  for (const [recipeName, keywords] of Object.entries(keywordSets)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase()))
        return { name: recipeName, reason: `matched recipe keyword: ${keyword}` }
    }
  }
  return null
}

function commandAvailable(command, args, env, cwdPath) {
  const result = runProcess(command, args, {
    allowFailure: true,
    cwd: cwdPath,
    env,
  })
  return result.status === 0
}

function resolveWorkspaceRoot(cwdPath) {
  const bootstrap = readJsonIfExists(join(cwdPath, 'docs', 'project', 'bootstrap.json'))
  if (bootstrap?.workspaceRoot)
    return resolve(cwdPath, bootstrap.workspaceRoot)
  return join(cwdPath, 'workspace')
}

function collectWorkspaceSignals(workspaceRoot) {
  if (!existsSync(workspaceRoot))
    return ''

  const chunks = []
  const entries = readdirSync(workspaceRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .slice(0, 20)

  for (const entry of entries) {
    const workspacePath = join(workspaceRoot, entry.name)
    const kickoff = readJsonIfExists(join(workspacePath, 'kickoff.json'))
    if (kickoff)
      chunks.push(JSON.stringify(kickoff))

    const interfaceMapPath = join(workspacePath, 'tool-interface-map.md')
    if (existsSync(interfaceMapPath))
      chunks.push(readFileSync(interfaceMapPath, 'utf-8'))
  }

  return chunks.join('\n')
}

function collectStartContext(args) {
  const cwdPath = resolve(args.cwd || process.cwd())
  const pkg = readJsonIfExists(join(cwdPath, 'package.json'))
  const workspaceSignals = collectWorkspaceSignals(resolveWorkspaceRoot(cwdPath))
  const repo = args.repo || inferRepoFromOrigin()
  const scriptsText = Object.values(pkg?.scripts || {}).join('\n')
  const repoText = [scriptsText, workspaceSignals, repo].join('\n')
  const env = args.env || process.env

  return {
    cwdPath,
    pkg,
    repo,
    repoText,
    toolAvailability: {
      gh: commandAvailable('gh', ['--help'], env, cwdPath),
      vercel: commandAvailable('vercel', ['--help'], env, cwdPath),
      opencli: commandAvailable('opencli', ['--help'], env, cwdPath),
      playwright: commandAvailable('pnpm', ['exec', 'playwright', '--help'], env, cwdPath),
    },
  }
}

function scoreRecipeSignals(context) {
  const scores = {
    'official-cli': { score: 0, reason: '' },
    opencli: { score: 0, reason: '' },
    'cli-anything': { score: 0, reason: '' },
  }

  const officialSignal = detectKeyword({
    'official-cli': ['gh', 'vercel', 'playwright', 'docker'],
  }, context.repoText)
  if (officialSignal) {
    scores['official-cli'] = {
      score: 2,
      reason: `matched repo/workspace signal: ${officialSignal.reason.replace('matched recipe keyword: ', '')}`,
    }
  }

  const opencliSignal = detectKeyword({ opencli: RECIPE_KEYWORDS.opencli }, context.repoText)
  if (opencliSignal) {
    scores.opencli = {
      score: 2,
      reason: `matched repo/workspace signal: ${opencliSignal.reason.replace('matched recipe keyword: ', '')}`,
    }
  }

  const cliAnythingSignal = detectKeyword({ 'cli-anything': RECIPE_KEYWORDS['cli-anything'] }, context.repoText)
  if (cliAnythingSignal) {
    scores['cli-anything'] = {
      score: 2,
      reason: `matched repo/workspace signal: ${cliAnythingSignal.reason.replace('matched recipe keyword: ', '')}`,
    }
  }

  if (context.repo) {
    scores['official-cli'].score += 1
    scores['official-cli'].reason ||= 'detected GitHub repository context'
  }

  if (scores['official-cli'].score > 0 && (context.toolAvailability.gh || context.toolAvailability.vercel || context.toolAvailability.playwright)) {
    scores['official-cli'].score += 1
    scores['official-cli'].reason ||= 'local official CLI toolchain is available'
  }

  if (scores.opencli.score > 0 && context.toolAvailability.opencli) {
    scores.opencli.score += 1
    scores.opencli.reason ||= 'local opencli is available'
  }

  return scores
}

function printHelp() {
  console.log(`delivery-os

Commands:
- init              bootstrap local repo + GitHub repo
- start             smart entrypoint that picks a recipe and scaffolds a workspace
- feature           create a workspace from a request
- issue             create a workspace from a GitHub issue
- check             run repository health checks
- labels            sync GitHub labels
- guide             show the recommended step-by-step usage
- recipes           show reusable interface orchestration recipes
- bootstrap-repo    bootstrap only docs/project and workspace root
- bootstrap-github  bootstrap only GitHub metadata and labels
- bootstrap-all     alias of init

Recommended order:
1. delivery-os guide
2. delivery-os start --title "Workflow title" --summary "What you want to build"
3. delivery-os recipes
4. delivery-os init --project "New Product" --repo <owner/repo>
5. delivery-os feature --title "Feature title" --summary "Feature summary"
6. delivery-os check --repo <owner/repo>
7. delivery-os check --repo <owner/repo> --check-toolchain
`)
}

function printGuide() {
  console.log(`Delivery OS Guide

What this CLI is for:
- orchestrate how you build things with existing tools
- initialize a repository for the delivery workflow
- create a workspace for each request
- validate that local files and GitHub setup are complete

This system is not trying to replace every tool with one giant CLI.
It is the orchestration layer for:
- official CLIs such as gh, vercel, docker, playwright
- websites, Electron apps, and external tools through opencli
- source-available tools without mature CLIs through CLI-Anything

Use it in this order:

Step 0. Choose the right interface path

Use an official CLI when one exists:
- GitHub -> gh
- deploys -> vercel
- containers -> docker
- tests -> project scripts or playwright

Use opencli when the target is:
- a website
- an Electron app
- an external CLI you want to drive through one hub

Use CLI-Anything when the target is:
- source-available
- missing a mature CLI
- worth turning into a repeatable agent-facing command surface

The point is to use those interfaces to create useful products, demos, automations, and experiments.

Step 1. Use the low-friction starter when you are unsure
Command:
delivery-os start --title "Workflow title" --summary "What you want to build"

What it does:
- detects the most likely recipe
- scaffolds the workspace for that path
- prefills recipe-specific documents

Step 2. Initialize the repository once
Command:
delivery-os init --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>

What it does:
- creates docs/project/
- creates workspace/
- configures GitHub description, homepage, topics
- syncs standard labels

Step 3. Create a workspace for a request when you want direct control
Command:
delivery-os feature --title "Feature title" --summary "Feature summary"

If the request needs external tools or adapters:
delivery-os feature --title "Feature title" --summary "Feature summary" --with-interface-map

If you want to suppress the automatic interface map:
delivery-os feature --title "Feature title" --summary "Feature summary" --without-interface-map

What it does:
- routes the request to Flash Launch, Product Iteration, or Legacy Maintenance
- creates workspace/<slug>/
- copies the minimum artifact pack for that mode
- writes README.md, kickoff.json, and next-steps.md
- automatically adds tool-interface-map.md when the request looks interface-heavy
- still lets you force or suppress that file explicitly

Step 4. Or create a workspace from a GitHub issue
Command:
delivery-os issue --repo <owner/repo> --issue <number>

What it does:
- reads the issue title, body, and labels
- resolves the mode from labels or text
- generates the same workspace package as feature
- saves issue-source.json for traceability

Step 5. Validate the setup
Command:
delivery-os check --repo <owner/repo>

If you also want to verify the local toolchain:
delivery-os check --repo <owner/repo> --check-toolchain
delivery-os check --repo <owner/repo> --check-toolchain all

What it checks:
- required local files
- required package.json scripts
- docs/project bootstrap metadata
- GitHub topics, description, homepage, and labels
- optional toolchain access for the CLIs inferred from the repo or workspace
- full toolchain access for gh, vercel, opencli, and playwright when you use --check-toolchain all

Fast mental model:
- choose the interface path first
- reuse a recipe before inventing a new flow
- init once per repository
- feature or issue once per request
- check before release or when setup looks wrong
`)
}

function printRecipes() {
  console.log(`Delivery OS Recipes

Use these when the goal is to create something by orchestrating existing tools instead of rebuilding them.

1. Official CLI recipe
Best for:
- mature services with strong CLIs
- shipping features with gh, vercel, docker, playwright

Start here:
- docs/recipes/official-cli-delivery.md

2. Website or desktop automation recipe
Best for:
- websites
- Electron apps
- tools that need browser-driven or desktop-driven actions

Start here:
- docs/recipes/opencli-automation.md

3. Source-available tool adapter recipe
Best for:
- open-source or internal tools without a mature CLI
- turning repetitive operations into a reusable command surface

Start here:
- docs/recipes/cli-anything-adapter.md

4. Example workspace with interface map
Start here:
- examples/workspace-interface-automation/README.md

Recommended sequence:
1. pick the closest recipe
2. scaffold a starter:
   delivery-os recipes <official-cli|opencli|cli-anything> --title "Workflow title"
3. fill tool-interface-map.md with the real targets and commands when present
4. execute the workflow and capture validation evidence
`)
}

function printRecipeUsage() {
  console.log(`Recipe scaffolding

Usage:
- delivery-os recipes
- delivery-os recipes official-cli --title "Workflow title"
- delivery-os recipes opencli --title "Workflow title"
- delivery-os recipes cli-anything --title "Workflow title"

Optional flags:
- --summary "Custom summary"
- --mode <flash|product|legacy>
- --out <path>
- --dry-run
- --with-interface-map
- --without-interface-map
`)
}

function printStartUsage() {
  console.log(`Smart start

Usage:
- delivery-os start --title "Workflow title" --summary "What you want to build"

Optional flags:
- --recipe <official-cli|opencli|cli-anything>
- --mode <flash|product|legacy>
- --out <path>
- --dry-run
- --with-interface-map
- --without-interface-map

Behavior:
- detects the closest recipe from your request text
- falls back to repo scripts, existing workspaces, and local tool availability when the request text is generic
- defaults to official-cli when no interface-heavy signal is found
- scaffolds and prefills the workspace for the selected path
`)
}

function printCheckUsage() {
  console.log(`Doctor / check

Usage:
- delivery-os check --repo <owner/repo>
- delivery-os check --repo <owner/repo> --workspace <path>
- delivery-os check --repo <owner/repo> --check-toolchain
- delivery-os check --repo <owner/repo> --check-toolchain all
- delivery-os check --repo <owner/repo> --toolchain gh,vercel

Optional flags:
- --kind <business|template|generic>
- --skip-remote
- --check-toolchain [auto|all]
- --toolchain <gh,vercel,opencli,playwright>
- --workspace <path>
`)
}

function createRecipeWorkspace(recipeName, args) {
  const preset = RECIPE_PRESETS[recipeName]
  if (!preset)
    throw new Error(`Unknown recipe: ${recipeName}`)

  const lang = args.lang === 'en' ? 'en' : 'zh'
  const workspaceArgs = {
    ...args,
    title: args.title || preset.title,
    summary: args.summary || preset.summary,
    mode: args.mode || preset.mode,
    reason: args.reason || `recipe starter: ${preset.label}`,
  }

  if (preset.withInterfaceMap && !args['without-interface-map'])
    workspaceArgs['with-interface-map'] = true

  const result = {
    recipe: preset,
    language: lang,
    requestTitle: workspaceArgs.title,
    workspace: createWorkspace(workspaceArgs),
  }

  if (!args['dry-run'])
    applyRecipePrefill(result)

  return result
}

function createStartWorkspace(args) {
  const title = args.title || args.name
  if (!title)
    throw new Error('Missing required argument: --title')

  const summary = args.summary || ''
  const selection = detectRecipeSelection({ ...args, title, summary })
  const result = createRecipeWorkspace(selection.name, {
    ...args,
    title,
    summary,
    reason: args.reason || `smart start: ${selection.reason}`,
  })

  return {
    selection,
    ...result,
  }
}

function printRecipeWorkspaceResult(result) {
  console.log(`Recipe: ${result.recipe.label}`)
  console.log(`Recipe doc: ${result.recipe.docPath}`)
  printWorkspaceResult(result.workspace)
  console.log('Next:')
  console.log(`- Open ${result.recipe.docPath}`)
  if (result.workspace.optionalArtifacts.includes('tool-interface-map'))
    console.log(`- Fill ${result.workspace.outDir}/tool-interface-map.md`)
  console.log(`- Continue from ${result.workspace.outDir}/implementation-plan.md`)
}

function printStartWorkspaceResult(result) {
  console.log(`Start route: ${result.recipe.label}`)
  console.log(`Selection reason: ${result.selection.reason}`)
  printRecipeWorkspaceResult(result)
}

function detectRecipeSelection(args) {
  if (args.recipe) {
    const preset = RECIPE_PRESETS[args.recipe]
    if (!preset)
      throw new Error(`Unknown recipe: ${args.recipe}`)
    return { name: args.recipe, reason: `explicit recipe: ${args.recipe}` }
  }

  const textSelection = detectKeyword(RECIPE_KEYWORDS, `${args.title || ''}\n${args.summary || ''}`)
  if (textSelection)
    return textSelection

  const context = collectStartContext(args)
  const scores = scoreRecipeSignals(context)
  const ranked = Object.entries(scores)
    .filter(([, value]) => value.score > 0)
    .sort((left, right) => right[1].score - left[1].score)

  if (ranked.length > 0) {
    const [recipeName, winner] = ranked[0]
    return { name: recipeName, reason: winner.reason }
  }

  return { name: 'official-cli', reason: 'defaulted to official-cli for the lowest-friction path' }
}

function applyRecipePrefill(result) {
  const implementationPlanPath = join(result.workspace.outDir, 'implementation-plan.md')
  const interfaceMapPath = join(result.workspace.outDir, 'tool-interface-map.md')
  const taskBreakdownPath = join(result.workspace.outDir, 'task-breakdown.md')
  const releaseChecklistPath = join(result.workspace.outDir, 'release-checklist.md')

  if (existsSync(implementationPlanPath))
    writeFileSync(implementationPlanPath, buildRecipeImplementationPlan(result))

  if (existsSync(interfaceMapPath))
    writeFileSync(interfaceMapPath, buildRecipeInterfaceMap(result))

  if (existsSync(taskBreakdownPath))
    writeFileSync(taskBreakdownPath, buildRecipeTaskBreakdown(result))

  if (existsSync(releaseChecklistPath))
    writeFileSync(releaseChecklistPath, buildRecipeReleaseChecklist(result))
}

function buildRecipeImplementationPlan(result) {
  if (result.language === 'en')
    return buildRecipeImplementationPlanEn(result)
  return buildRecipeImplementationPlanZh(result)
}

function buildRecipeImplementationPlanEn(result) {
  const recipeSpecific = {
    'official-cli': {
      systems: '- GitHub\n- Deployment\n- Validation tooling',
      prompts: '- Use `gh`, `vercel`, `docker`, and project-local scripts directly.\n- Avoid introducing extra adapters.',
      tests: '| Workflow | Smoke | `gh pr checks` | |\n| Deployment | Verification | `vercel inspect <deployment-url>` | |\n| Repo | Local validation | `pnpm test` | |',
    },
    opencli: {
      systems: '- Website or admin dashboard\n- Browser-driven workflow\n- Repo-local validation',
      prompts: '- Keep browser automation steps explicit.\n- Separate auth setup from product logic validation.\n- Capture screenshots or traces when needed.',
      tests: '| Browser | Guided automation | `opencli doctor` and real target commands | |\n| Repo | Local validation | `pnpm test` | |\n| Smoke | Interface map review | manual review of `tool-interface-map.md` | |',
    },
    'cli-anything': {
      systems: '- Source-available target tool\n- Generated command surface\n- Repo-local validation',
      prompts: '- Confirm no better official CLI exists.\n- Keep the generated adapter focused on one real workflow.\n- Refine until the command surface is stable.',
      tests: '| Adapter | Workflow validation | `/cli-anything:test /path/to/target` | |\n| Adapter | End-to-end validation | `/cli-anything:validate /path/to/target` | |\n| Repo | Local validation | `pnpm test` | |',
    },
  }[result.recipe.name]

  return `# Implementation Plan

**Status**: \`draft\`
**Owner**:
**Created**:
**Last Updated**:
**Related PRD**:
**Related Design Spec**:
**Related Issue**:
**Target Branch**:
**Recipe**: ${result.recipe.label}
**Recipe Doc**: ${result.recipe.docPath}

## 1. Summary

### 1.1 Goal

Use the ${result.recipe.label} recipe to execute: ${result.workspace.route.mode === 'product' ? 'a product iteration' : 'an interface-heavy workflow'}.

### 1.2 Inputs

- Request title: ${result.requestTitle}
- Recipe doc: ${result.recipe.docPath}
- Interface map: ${result.workspace.optionalArtifacts.includes('tool-interface-map') ? 'required' : 'not required by default'}
- Constraints or assumptions:

## 2. Delivery Strategy

### 2.1 Implementation Shape

- Single PR or multiple PRs:
- Behind feature flag or direct release:
- Migration required or not:
- Parallelizable workstreams:

### 2.2 Sequence

1. Open the recipe doc and confirm the interface path.
2. Fill the workspace documents with the real target systems and commands.
3. Execute the smallest reliable workflow end to end.
4. Capture validation evidence and release notes.

## 3. Systems Touched

${recipeSpecific.systems}

## 4. Recipe-Specific Notes

${recipeSpecific.prompts}

## 5. Test Plan

| Layer | Test Type | Command | Owner |
|-------|-----------|---------|-------|
${recipeSpecific.tests}

## 6. Completion Criteria

- [ ] Recipe doc reviewed
- [ ] Interface choices recorded
- [ ] Real commands captured
- [ ] Validation evidence collected
- [ ] Release and rollback notes updated
`
}

function buildRecipeImplementationPlanZh(result) {
  const recipeSpecific = {
    'official-cli': {
      systems: '- GitHub\n- 发布系统\n- 验证工具链',
      prompts: '- 直接用 `gh`、`vercel`、`docker` 和仓库脚本。\n- 不要额外引入 adapter。',
      tests: '| Workflow | 冒烟 | `gh pr checks` | |\n| Deployment | 验证 | `vercel inspect <deployment-url>` | |\n| Repo | 本地验证 | `pnpm test` | |',
    },
    opencli: {
      systems: '- 网站或后台面板\n- 浏览器驱动流程\n- 仓库内本地验证',
      prompts: '- 浏览器动作必须写清楚。\n- 把鉴权准备和产品逻辑验证分开。\n- 需要时保留截图或 trace。',
      tests: '| Browser | 引导式自动化 | `opencli doctor` 和真实目标命令 | |\n| Repo | 本地验证 | `pnpm test` | |\n| Smoke | 接口地图复核 | 人工复核 `tool-interface-map.md` | |',
    },
    'cli-anything': {
      systems: '- 有源码的目标工具\n- 生成出来的命令面\n- 仓库内本地验证',
      prompts: '- 先确认没有更好的官方 CLI。\n- 生成的 adapter 只服务一条真实工作流。\n- refine 到命令面稳定为止。',
      tests: '| Adapter | 工作流验证 | `/cli-anything:test /path/to/target` | |\n| Adapter | 端到端验证 | `/cli-anything:validate /path/to/target` | |\n| Repo | 本地验证 | `pnpm test` | |',
    },
  }[result.recipe.name]

  return `# 实现计划

**状态**: \`draft\`
**负责人**:
**创建日期**:
**最后更新**:
**关联 PRD**:
**关联设计规格**:
**关联 Issue**:
**目标分支**:
**Recipe**: ${result.recipe.label}
**Recipe 文档**: ${result.recipe.docPath}

## 1. 概述

### 1.1 实现目标

基于 ${result.recipe.label} 这条套路推进当前请求，并把真实接口路径落到 workspace 文档中。

### 1.2 输入信息

- 请求标题：${result.requestTitle}
- Recipe 文档：${result.recipe.docPath}
- 工具接口地图：${result.workspace.optionalArtifacts.includes('tool-interface-map') ? '需要补齐' : '默认不要求'}
- 约束或假设：

## 2. 交付策略

### 2.1 实施形态

- 单个 PR 还是多个 PR：
- 是否通过 Feature Flag 控制：
- 是否涉及迁移：
- 哪些部分可以并行：

### 2.2 实施顺序

1. 先读 recipe 文档，确认接口路径。
2. 把真实目标系统和命令补进 workspace。
3. 跑通最小可靠流程。
4. 记录验证证据和发布说明。

## 3. 影响系统

${recipeSpecific.systems}

## 4. Recipe 特定要求

${recipeSpecific.prompts}

## 5. 测试计划

| 层级 | 测试类型 | 命令 | 负责人 |
|------|----------|------|--------|
${recipeSpecific.tests}

## 6. 完成标准

- [ ] 已阅读 recipe 文档
- [ ] 已记录接口选择
- [ ] 已写入真实命令面
- [ ] 已保留验证证据
- [ ] 已更新发布与回滚说明
`
}

function buildRecipeInterfaceMap(result) {
  if (result.language === 'en')
    return buildRecipeInterfaceMapEn(result)
  return buildRecipeInterfaceMapZh(result)
}

function buildRecipeInterfaceMapEn(result) {
  const mappings = {
    opencli: {
      outcome: 'drive a website or desktop workflow through opencli',
      routing: '| Admin website | Website | `opencli` | Browser-driven actions are required | Ops |\n| Repo validation | Local repo | project scripts | Keep code validation separate from browser actions | Eng |',
      targets: '| Admin website | browser session | real site URL | required | session expiry or wrong account |\n| Local repo | repo access | local path | required | validation drift |',
      commands: '# opencli\nopencli doctor\nopencli daemon status\n# replace with the real site command set\n\n# project-local scripts\npnpm test',
    },
    'cli-anything': {
      outcome: 'turn a source-available tool into a reusable command surface',
      routing: '| Source-available tool | Repo / app | `CLI-Anything` | No mature CLI exists yet | Eng |\n| Repo validation | Local repo | project scripts | Validate the workflow outside the adapter too | Eng |',
      targets: '| Target tool | source access | local repo path | required | unstable generated interface |\n| Local repo | repo access | local path | required | missing validation coverage |',
      commands: '# CLI-Anything\n# /cli-anything /path/to/target\n# /cli-anything:refine /path/to/target\n# /cli-anything:test /path/to/target\n# /cli-anything:validate /path/to/target\n\n# project-local scripts\npnpm test',
    },
  }[result.recipe.name]

  if (!mappings)
    return ''

  return `# Tool Interface Map

## 1. Outcome

- What are we trying to build: ${mappings.outcome}
- Why does this need external tools or interfaces: the workflow depends on a non-trivial interface path
- Expected output or deliverable: one repeatable workflow with a documented command surface

## 2. Interface Routing

| Target | Category | Chosen Interface | Why This Path | Owner |
|--------|----------|------------------|---------------|-------|
${mappings.routing}

## 3. Target Systems

| Target | Access Needed | Entry Command or URL | Auth State | Risks |
|--------|---------------|----------------------|------------|-------|
${mappings.targets}

## 4. Command Surface

\`\`\`bash
${mappings.commands}
\`\`\`

## 5. Execution Plan

1. Confirm auth and environment access.
2. Replace the placeholders with real target commands.
3. Run the workflow end to end.
4. Capture logs, screenshots, or traces.
5. Document the fallback path.
`
}

function buildRecipeInterfaceMapZh(result) {
  const mappings = {
    opencli: {
      outcome: '通过 opencli 驱动网站或桌面工作流',
      routing: '| 管理后台 | 网站 | `opencli` | 需要浏览器驱动动作 | 运营 |\n| 仓库验证 | 本地仓库 | 仓库脚本 | 让代码验证和浏览器动作分离 | 工程 |',
      targets: '| 管理后台 | 浏览器会话 | 真实站点 URL | required | 会话过期或账号错误 |\n| 本地仓库 | 仓库访问权限 | 本地路径 | required | 验证漂移 |',
      commands: '# opencli\nopencli doctor\nopencli daemon status\n# 换成真实站点命令\n\n# 仓库内脚本\npnpm test',
    },
    'cli-anything': {
      outcome: '把有源码的工具收敛成可复用命令面',
      routing: '| 有源码目标工具 | 仓库 / 应用 | `CLI-Anything` | 还没有成熟 CLI | 工程 |\n| 仓库验证 | 本地仓库 | 仓库脚本 | adapter 外也要独立验证流程 | 工程 |',
      targets: '| 目标工具 | 源码访问权限 | 本地仓库路径 | required | 生成出来的接口不稳定 |\n| 本地仓库 | 仓库访问权限 | 本地路径 | required | 验证覆盖不足 |',
      commands: '# CLI-Anything\n# /cli-anything /path/to/target\n# /cli-anything:refine /path/to/target\n# /cli-anything:test /path/to/target\n# /cli-anything:validate /path/to/target\n\n# 仓库内脚本\npnpm test',
    },
  }[result.recipe.name]

  if (!mappings)
    return ''

  return `# 工具接口地图

## 1. 目标产出

- 这次要做成什么：${mappings.outcome}
- 为什么这次需要接外部工具或接口：这条工作流依赖非平凡的接口路径
- 预期输出或交付物：一条可重复执行且命令面明确的流程

## 2. 接口路由

| 目标 | 类型 | 选定接口 | 为什么这样选 | 负责人 |
|------|------|----------|--------------|--------|
${mappings.routing}

## 3. 目标系统清单

| 目标 | 所需权限 | 入口命令或 URL | 当前鉴权状态 | 风险 |
|------|----------|----------------|--------------|------|
${mappings.targets}

## 4. 命令面

\`\`\`bash
${mappings.commands}
\`\`\`

## 5. 执行计划

1. 先确认鉴权和环境可用。
2. 把占位内容替换成真实目标命令。
3. 跑通整条工作流。
4. 保留日志、截图或 trace。
5. 记录失败回退路径。
`
}

function buildRecipeTaskBreakdown(result) {
  if (result.language === 'en')
    return buildRecipeTaskBreakdownEn(result)
  return buildRecipeTaskBreakdownZh(result)
}

function buildRecipeTaskBreakdownEn(result) {
  const content = {
    'official-cli': {
      objective: 'Execute the request through mature official CLIs with clear validation and release ownership.',
      workstreams: '| Delivery | Drive the workflow with official CLIs | Eng | Pending |\n| Validation | Confirm local and CI checks | QA | Pending |\n| Release | Verify preview and production flow | Release | Pending |',
      tasks: '| CLI-1 | Delivery | Run the main workflow with `gh`, `vercel`, and project scripts | | | | Pending | `gh pr checks`, `pnpm test`, `vercel inspect` |\n| QA-1 | Validation | Verify the shipped path and rollback path | | CLI-1 | | Pending | smoke checks |\n| OPS-1 | Release | Confirm deployment, monitoring, and rollback notes | | QA-1 | | Pending | release checklist |',
    },
    opencli: {
      objective: 'Drive a browser-heavy or desktop-heavy workflow with opencli while keeping repo validation explicit.',
      workstreams: '| Browser | Automate the website or desktop path | Ops | Pending |\n| Repo | Keep code or config validation separate | Eng | Pending |\n| Release | Verify evidence and fallback steps | Release | Pending |',
      tasks: '| BR-1 | Browser | Record the real `opencli` target commands and auth requirements | | | | Pending | `tool-interface-map.md` review |\n| ENG-1 | Repo | Run local validation outside the browser path | | BR-1 | | Pending | `pnpm test` |\n| QA-1 | Release | Capture screenshots, logs, or traces for the happy path and failure path | | ENG-1 | | Pending | manual evidence |\n| OPS-1 | Release | Document retry and rollback steps | | QA-1 | | Pending | release checklist |',
    },
    'cli-anything': {
      objective: 'Create and stabilize a reusable adapter workflow for a source-available tool.',
      workstreams: '| Adapter | Generate and refine the command surface | Eng | Pending |\n| Validation | Prove one real workflow end to end | QA | Pending |\n| Release | Document support and fallback expectations | Release | Pending |',
      tasks: '| AD-1 | Adapter | Generate the initial command surface with CLI-Anything | | | | Pending | `/cli-anything /path/to/target` |\n| AD-2 | Adapter | Refine the generated interface until the workflow is stable | | AD-1 | | Pending | `/cli-anything:refine /path/to/target` |\n| QA-1 | Validation | Validate one real end-to-end workflow | | AD-2 | | Pending | `/cli-anything:validate /path/to/target` |\n| OPS-1 | Release | Record ownership, failure modes, and rollback expectations | | QA-1 | | Pending | release checklist |',
    },
  }[result.recipe.name]

  return `# Task Breakdown

**Status**: \`draft\`
**Owner**:
**Created**:
**Last Updated**:
**Related Implementation Plan**: implementation-plan.md
**Milestone**: ${result.recipe.label}

## 1. Summary

### 1.1 Objective

${content.objective}

### 1.2 Delivery Rules

- Keep tasks independently reviewable
- Prefer small PRs when risk is medium or high
- Tie every task to real commands or evidence
- Escalate auth and environment blockers early

## 2. Workstreams

| Workstream | Goal | Owner | Status |
|------------|------|-------|--------|
${content.workstreams}

## 3. Task List

| ID | Workstream | Task | Owner | Depends On | Estimate | Status | Validation |
|----|------------|------|-------|------------|----------|--------|------------|
${content.tasks}

## 4. Completion Criteria

- [ ] Real commands are recorded
- [ ] Validation evidence is attached
- [ ] Blockers are documented
- [ ] Release handoff is ready
`
}

function buildRecipeTaskBreakdownZh(result) {
  const content = {
    'official-cli': {
      objective: '通过成熟官方 CLI 推进请求，并把验证和发布责任拆清楚。',
      workstreams: '| Delivery | 用官方 CLI 驱动整条流程 | 工程 | Pending |\n| Validation | 确认本地和 CI 验证通过 | QA | Pending |\n| Release | 确认预览和生产发布流程 | Release | Pending |',
      tasks: '| CLI-1 | Delivery | 用 `gh`、`vercel` 和仓库脚本跑主流程 | | | | Pending | `gh pr checks`、`pnpm test`、`vercel inspect` |\n| QA-1 | Validation | 验证上线路径和回滚路径 | | CLI-1 | | Pending | 冒烟检查 |\n| OPS-1 | Release | 确认发布、监控和回滚说明 | | QA-1 | | Pending | 发布清单 |',
    },
    opencli: {
      objective: '用 opencli 驱动浏览器或桌面工作流，同时保持仓库内验证清晰独立。',
      workstreams: '| Browser | 自动化网站或桌面路径 | 运营 | Pending |\n| Repo | 单独跑代码或配置验证 | 工程 | Pending |\n| Release | 确认验证证据和回退步骤 | Release | Pending |',
      tasks: '| BR-1 | Browser | 记录真实 `opencli` 目标命令和鉴权要求 | | | | Pending | 复核 `tool-interface-map.md` |\n| ENG-1 | Repo | 在浏览器路径之外单独跑本地验证 | | BR-1 | | Pending | `pnpm test` |\n| QA-1 | Release | 保留主路径和失败路径的截图、日志或 trace | | ENG-1 | | Pending | 人工证据 |\n| OPS-1 | Release | 记录重试和回滚步骤 | | QA-1 | | Pending | 发布清单 |',
    },
    'cli-anything': {
      objective: '给有源码的工具生成并稳定一套可复用 adapter 工作流。',
      workstreams: '| Adapter | 生成并 refine 命令面 | 工程 | Pending |\n| Validation | 证明一条真实流程可以跑通 | QA | Pending |\n| Release | 记录支持边界和回退预期 | Release | Pending |',
      tasks: '| AD-1 | Adapter | 用 CLI-Anything 生成初始命令面 | | | | Pending | `/cli-anything /path/to/target` |\n| AD-2 | Adapter | 持续 refine 直到接口稳定 | | AD-1 | | Pending | `/cli-anything:refine /path/to/target` |\n| QA-1 | Validation | 验证一条真实端到端流程 | | AD-2 | | Pending | `/cli-anything:validate /path/to/target` |\n| OPS-1 | Release | 记录负责人、失败模式和回滚预期 | | QA-1 | | Pending | 发布清单 |',
    },
  }[result.recipe.name]

  return `# 任务拆解

**状态**: \`draft\`
**负责人**:
**创建日期**:
**最后更新**:
**关联实现计划**: implementation-plan.md
**里程碑**: ${result.recipe.label}

## 1. 概述

### 1.1 目标

${content.objective}

### 1.2 执行规则

- 任务应尽量独立、易审查
- 中高风险优先拆成小 PR
- 每个任务都要绑定真实命令或验证证据
- 鉴权和环境阻塞要尽早升级

## 2. 工作流分组

| 工作流 | 目标 | 负责人 | 状态 |
|--------|------|--------|------|
${content.workstreams}

## 3. 任务清单

| ID | 工作流 | 任务 | 负责人 | 依赖 | 预估 | 状态 | 验证方式 |
|----|--------|------|--------|------|------|------|----------|
${content.tasks}

## 4. 完成标准

- [ ] 已记录真实命令面
- [ ] 已保留验证证据
- [ ] 已记录阻塞
- [ ] 发布交接材料已准备
`
}

function buildRecipeReleaseChecklist(result) {
  if (result.language === 'en')
    return buildRecipeReleaseChecklistEn(result)
  return buildRecipeReleaseChecklistZh(result)
}

function buildRecipeReleaseChecklistEn(result) {
  const content = {
    'official-cli': {
      shipping: '- The workflow uses existing official CLIs\n- Validation and release commands are recorded',
      commands: 'gh pr checks\npnpm test\nvercel\nvercel --prod',
      post: '- [ ] Preview or production deployment verified\n- [ ] Official CLI outputs saved as evidence',
    },
    opencli: {
      shipping: '- The browser or desktop workflow is documented\n- The repo validation path is separated from browser actions',
      commands: 'opencli doctor\nopencli daemon status\npnpm test',
      post: '- [ ] Browser evidence captured\n- [ ] Session or auth retry path documented',
    },
    'cli-anything': {
      shipping: '- The generated adapter supports one real workflow\n- The adapter validation path is documented',
      commands: '# /cli-anything /path/to/target\n# /cli-anything:refine /path/to/target\n# /cli-anything:validate /path/to/target\npnpm test',
      post: '- [ ] Adapter validation evidence saved\n- [ ] Failure and fallback expectations documented',
    },
  }[result.recipe.name]

  return `# Release Checklist

**Release Name**: ${result.requestTitle}
**Environment**:
**Owner**:
**Recipe**: ${result.recipe.label}
**Recipe Doc**: ${result.recipe.docPath}

## 1. Release Summary

### 1.1 What Is Shipping

${content.shipping}

## 2. Preconditions

- [ ] Recipe doc reviewed
- [ ] Workspace documents updated with real commands
- [ ] Validation commands confirmed
- [ ] Rollback owner assigned

## 3. Deployment Or Execution Commands

\`\`\`bash
${content.commands}
\`\`\`

## 4. Post-Release Or Post-Run Verification

${content.post}

## 5. Rollback Notes

- [ ] Retry path documented
- [ ] Rollback or fallback path documented
- [ ] Known risks recorded
`
}

function buildRecipeReleaseChecklistZh(result) {
  const content = {
    'official-cli': {
      shipping: '- 本次流程基于现成官方 CLI 执行\n- 验证和发布命令已明确记录',
      commands: 'gh pr checks\npnpm test\nvercel\nvercel --prod',
      post: '- [ ] 已确认预览或生产发布结果\n- [ ] 已保留官方 CLI 输出作为证据',
    },
    opencli: {
      shipping: '- 已记录浏览器或桌面工作流\n- 已把仓库内验证路径和浏览器动作分开',
      commands: 'opencli doctor\nopencli daemon status\npnpm test',
      post: '- [ ] 已保留浏览器证据\n- [ ] 已记录会话或鉴权重试路径',
    },
    'cli-anything': {
      shipping: '- 生成出来的 adapter 已支持一条真实工作流\n- adapter 验证路径已记录',
      commands: '# /cli-anything /path/to/target\n# /cli-anything:refine /path/to/target\n# /cli-anything:validate /path/to/target\npnpm test',
      post: '- [ ] 已保留 adapter 验证证据\n- [ ] 已记录失败和回退预期',
    },
  }[result.recipe.name]

  return `# 发布检查清单

**发布名称**: ${result.requestTitle}
**环境**:
**负责人**:
**Recipe**: ${result.recipe.label}
**Recipe 文档**: ${result.recipe.docPath}

## 1. 发布概述

### 1.1 本次发布内容

${content.shipping}

## 2. 发布前提

- [ ] 已阅读 recipe 文档
- [ ] 已把真实命令补进 workspace
- [ ] 已确认验证命令
- [ ] 已明确回滚负责人

## 3. 执行或发布命令

\`\`\`bash
${content.commands}
\`\`\`

## 4. 执行后或发布后验证

${content.post}

## 5. 回退说明

- [ ] 已记录重试路径
- [ ] 已记录回滚或兜底路径
- [ ] 已记录已知风险
`
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  const recipesSubcommand = command === 'recipes' || command === 'patterns'
    ? (rest[0] && !rest[0].startsWith('--') ? rest[0] : '')
    : ''
  const parsedRest = recipesSubcommand ? rest.slice(1) : rest
  const args = parseArgs(rest)
  const recipeArgs = recipesSubcommand ? parseArgs(parsedRest) : args

  try {
    switch (command) {
      case 'init':
      case 'bootstrap-all':
        runBootstrapAll(args)
        return
      case 'start':
        if (rest[0] === 'help')
          printStartUsage()
        else
          printStartWorkspaceResult(createStartWorkspace(args))
        return
      case 'feature':
        printWorkspaceResult(createWorkspace(args))
        return
      case 'issue':
        printWorkspaceFromIssueResult(createWorkspaceFromIssue(args))
        return
      case 'check':
      case 'doctor':
        if (rest.includes('--help') || rest.includes('-h') || rest[0] === 'help')
          printCheckUsage()
        else
          printDoctorReport(runDoctor(args))
        return
      case 'labels':
        printSyncLabelsResult(syncLabels(args))
        return
      case 'guide':
      case 'overview':
        printGuide()
        return
      case 'recipes':
      case 'patterns':
        if (recipesSubcommand === 'help')
          printRecipeUsage()
        else if (recipesSubcommand)
          printRecipeWorkspaceResult(createRecipeWorkspace(recipesSubcommand, recipeArgs))
        else
          printRecipes()
        return
      case 'bootstrap-repo':
        printProjectBootstrapResult(createProjectBootstrap(args))
        return
      case 'bootstrap-github':
        printBootstrapGitHubResult(bootstrapGitHubRepo(args))
        return
      default:
        throw new Error(`Unknown command: ${command}`)
    }
  }
  catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
