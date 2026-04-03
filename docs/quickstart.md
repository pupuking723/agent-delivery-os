# Quick Start

如果你是第一次用这套系统，先不要学全部能力。
先只记住 3 个命令：

```bash
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "需求标题" --summary "需求说明"
pnpm health:check -- --repo <owner/repo>
```

## 这 3 个命令分别做什么

- `bootstrap:all`
  初始化一个新业务仓库，生成 `docs/project/` 骨架，并配置 GitHub 元数据和 labels
- `kickoff`
  为一个具体需求生成 workspace 文档包，并自动判断走哪种模式
- `health:check`
  检查本地仓库结构和 GitHub 远端配置有没有缺项

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

先 `bootstrap:all`，每个需求用 `kickoff`，做完跑 `health:check`。
