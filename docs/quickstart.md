# Quick Start

如果你是第一次用这套系统，先不要学全部能力。
先记住这 5 个入口：

```bash
pnpm guide
pnpm start:flow --title "需求标题" --summary "你想做什么"
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "需求标题" --summary "需求说明"
pnpm health:check -- --repo <owner/repo>
pnpm health:check -- --repo <owner/repo> --check-toolchain
```

如果你连“先做哪一步”都不确定，先执行：

```bash
pnpm guide
```

这个命令会直接输出步骤说明，不需要看图。

如果你只想走最简单路径，不想先学命令体系，可以直接运行：

```bash
pnpm start:flow --title "需求标题" --summary "你想做什么"
```

如果你想先看可复用套路，而不是先看抽象原则，再执行：

```bash
pnpm recipes
```

如果你更习惯中文文档，也可以直接看：

- [docs/recipes-zh/README.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/README.md)

如果你已经知道要走哪条接口路径，可以直接起 starter：

```bash
pnpm recipes opencli --title "需求标题"
```

在真正开始前，再记住一条能力接入原则：

- 目标系统已有成熟 CLI，优先直接用官方 CLI
- 目标是网站、Electron 或外部工具，优先用 `opencli`
- 目标是有源码但没有成熟 CLI 的系统，再考虑 `CLI-Anything`

## 这 5 个入口分别做什么

- `start:flow`
  最低门槛入口。根据标题和说明自动选择 `official-cli`、`opencli` 或 `CLI-Anything` 路径，并直接生成 starter workspace

- `bootstrap:all`
  初始化一个新业务仓库，生成 `docs/project/` 骨架，并配置 GitHub 元数据和 labels
- `kickoff`
  为一个具体需求生成 workspace 文档包，并自动判断走哪种模式
- `health:check`
  检查本地仓库结构和 GitHub 远端配置有没有缺项
- `health:check -- --check-toolchain`
  根据当前仓库和 workspace 自动挑出需要的 CLI 再做可用性检查

- `health:check -- --check-toolchain all`
  强制全量检查 `gh`、`vercel`、`opencli` 和 `playwright`

`pnpm guide`
  直接在终端输出推荐顺序和每一步的作用，适合第一次接触这套系统的人

如果这次需求要接网站、桌面工具、外部系统或缺 CLI 的开源项目，可以这样起 workspace：

```bash
pnpm kickoff --title "需求标题" --summary "需求说明" --with-interface-map
```

如果标题或说明里本来就明显提到了网站、后台、浏览器、桌面工具、`opencli`、`CLI-Anything`、外部系统等关键词，CLI 现在也会自动补上这份文档。

如果你明确不想生成它，可以这样写：

```bash
pnpm kickoff --title "需求标题" --summary "需求说明" --without-interface-map
```

## 最常见的用法

### 1. 新建一个业务仓库

```bash
pnpm bootstrap:all -- --project "AI 标题生成器" --repo-name "ai-title-generator" --repo <owner/repo>
pnpm health:check -- --repo <owner/repo>
```

### 2. 发起一个新需求

```bash
pnpm kickoff --title "新增团队邀请功能" --summary "已上线产品，需要新增邀请弹窗、角色分配和发布检查"
```

### 3. 从 GitHub issue 生成 workspace

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

### 4. 检查某个具体 workspace 是否完整

```bash
pnpm health:check -- --workspace examples/workspace-interface-automation --skip-remote
```

## Claude Code 里怎么说

你可以直接这样对 Claude Code 说：

- “这是一个新想法，帮我按 0 到 1 模式推进。”
- “这是已上线产品的新功能，按 Product Iteration 推进。”
- “这是旧项目维护，先补 system map，不要直接改代码。”

## 什么时候再学高级命令

只有在下面场景里，才需要再往下学：

- 你只想初始化本地项目骨架：看 [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)
- 你只想初始化 GitHub 元数据：看 [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- 你想看完整协作路径：看 [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)

## 最低心智模型

把这套系统记成一句话就够了：

先看 `guide`，再 `bootstrap:all`，每个需求用 `kickoff`，做完跑 `health:check`。
