# Delivery OS

[![Release](https://img.shields.io/github/v/release/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/releases/latest)
[![License](https://img.shields.io/github/license/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/blob/main/LICENSE)

[English README](./README.en.md)

> Agent-first delivery operating system for repeatable product execution.

一套面向 Claude Code 与 agent 工作流的交付操作系统，用来把：

`idea -> spec -> implementation -> validation -> release -> feedback`

变成可复用、可协作、可自动推进的仓库路径。

它的初衷不是把一切都重新发明成一个大而全 CLI，
而是把现有开源项目、官方 CLI、网页工具、桌面工具接到同一套 agent 编排里，
让用户能更稳定地做出各种产品、自动化和有意思的实验。

现在仓库同时提供两层入口：

- `delivery-os CLI`
- `Claude Code plugin`

适合三类场景：

- `Flash Launch`
  快速把想法上线验证市场
- `Product Iteration`
  持续迭代已上线产品
- `Legacy Maintenance`
  安全维护老项目或 vibe coding 项目

仓库内已经自带：

- 三模式路由
- issue -> workspace 自动化入口
- PR guardrails
- merge 后闭环提醒
- 示例 workspace 与 demo flow pack

## 先记住这 5 个入口

```bash
pnpm guide
pnpm start:flow --title "需求标题" --summary "你想做什么"
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "需求标题" --summary "需求说明"
pnpm health:check -- --repo <owner/repo>
```

如果你不清楚顺序，先运行：

```bash
pnpm guide
```

它会直接在终端里告诉你“先初始化仓库，再为需求生成 workspace，最后做检查”。

如果你只想用最简单入口直接开始，可以运行：

```bash
pnpm start:flow --title "需求标题" --summary "你想做什么"
```

如果你是第一次上手，先看 [docs/quickstart.md](/Users/mac/Desktop/other/全栈/docs/quickstart.md)。

如果你希望在 Claude Code 里用插件入口，见 [docs/plugin.md](/Users/mac/Desktop/other/全栈/docs/plugin.md)。

## Why This Repo

- 它不是单纯模板仓库，而是带有 GitHub 自动化的交付母版仓库
- 它不只管“开始做”，也管“怎么验证、怎么发布、怎么回写结果”
- 它既能给你个人使用，也能迁移到真实业务仓库里做团队协作入口
- 它强调“编排已有能力”，而不是重复造轮子：
  优先官方 CLI，其次 `opencli`，最后 `CLI-Anything`

## At A Glance

- 模式路由：`Flash Launch` / `Product Iteration` / `Legacy Maintenance`
- 自动化：issue labels、kickoff comment、artifact checklist、PR guardrails、merge follow-up
- 产物：中英文模板、prompt pack、playbook、demo flow pack
- 输出：稳定 workspace 路径、可追踪 artifact、可回写 iteration log

## 解决什么问题

- `Flash Launch`
  从 0 到 1，快速把想法上线验证市场
- `Product Iteration`
  从 1 到 100，围绕已上线产品持续迭代
- `Legacy Maintenance`
  安全维护老项目、接手项目和 vibe coding 项目

## 仓库结构

- `packages/core/`
  共享交付逻辑
- `packages/cli/`
  `delivery-os` CLI 入口
- `plugins/delivery-os/`
  Claude Code 插件入口
- `CLAUDE.md`
  Claude Code 的默认执行规则
- `docs/delivery-os/`
  模式路由、文档矩阵、状态机
- `docs/workflows/`
  三种工作流说明
- `docs/templates/`
  英文模板
- `docs/templates-zh/`
  中文模板
- `docs/prompt-pack/`
  Claude Code prompt 包
- `scripts/delivery-os/init.mjs`
  会根据任务描述自动判断模式并生成最小文档包
- `scripts/delivery-os/from-issue.mjs`
  会从 GitHub issue 读取内容并生成 workspace
- `scripts/github/sync-labels.mjs`
  会把仓库标签同步到 GitHub
- `examples/`
  示例 workspace

## 快速开始

第一次用，按这个顺序就够了：

```bash
pnpm guide
```

```bash
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
```

```bash
pnpm kickoff --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

```bash
pnpm health:check -- --repo <owner/repo>
```

更短的新手说明在 [docs/quickstart.md](/Users/mac/Desktop/other/全栈/docs/quickstart.md)。

如果你想先看“这套系统能怎样把各种工具拼起来”，先看：

- [docs/recipes/README.md](/Users/mac/Desktop/other/delivery-os/docs/recipes/README.md)
- [docs/recipes-zh/README.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/README.md)
- [examples/workspace-interface-automation/README.md](/Users/mac/Desktop/other/delivery-os/examples/workspace-interface-automation/README.md)

如果你已经知道要走哪条路径，也可以直接起手：

```bash
pnpm recipes opencli --title "需求标题"
```

如果你只想先看一条完整示例，直接从这里开始：

- [docs/quickstart.md](/Users/mac/Desktop/other/全栈/docs/quickstart.md)
- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
- [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)

## 高级命令

只有在你已经熟悉基本流程后，再看这些：

- 只初始化本地业务仓库骨架：
  `pnpm bootstrap:repo -- --project "新项目名" --repo-name "new-product-repo" --workspace-root "workspace"`
- 只初始化 GitHub 元数据：
  `pnpm bootstrap:github -- --repo <owner/repo> --project "新项目名"`
- 从 GitHub issue 生成 workspace：
  `pnpm kickoff:issue -- --repo <owner/repo> --issue <number>`
- 同步 GitHub labels：
  `pnpm labels:sync -- --repo <owner/repo>`
- 如果你仍然想用旧命名，检查命令也可以写成：
  `pnpm run doctor -- --repo <owner/repo>`

## CLI 与插件

- CLI 是稳定底座
- Claude Code 插件是薄入口层
- `CLI-Anything` 和 `OpenCLI` 不是默认依赖，只是可选 adapter

更准确地说：

- Delivery OS 负责“编排”
- 官方 CLI 负责成熟系统接入
- `OpenCLI` 负责网站 / 桌面工具 / 外部系统接入
- `CLI-Anything` 负责给缺 CLI 的开源项目补可复用命令面

## 推荐使用方式

1. 把这个仓库作为母版仓库持续演进
2. 在具体业务仓库里复制或同步模板、工作流和脚本
3. 每个业务仓库补自己的 `project-profile`、`system-map`、`iteration-log`

## GitHub 接入

- Issue 模板在 `.github/ISSUE_TEMPLATE/`
- PR 模板在 `.github/PULL_REQUEST_TEMPLATE.md`
- Labels 配置在 `.github/labels.json`
- GitHub Action 守门规则在 `.github/workflows/delivery-os-guardrails.yml`
- 安全披露规则在 [SECURITY.md](/Users/mac/Desktop/other/全栈/SECURITY.md)
- 使用支持入口在 [SUPPORT.md](/Users/mac/Desktop/other/全栈/SUPPORT.md)
- 协作行为准则在 [CODE_OF_CONDUCT.md](/Users/mac/Desktop/other/全栈/CODE_OF_CONDUCT.md)
- 仓库初始化与发布说明在 [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- 模板仓库落地指南在 [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)
- 协作约束说明在 [docs/repo/collaboration-defaults.md](/Users/mac/Desktop/other/全栈/docs/repo/collaboration-defaults.md)
- 端到端操作手册在 [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- 插件说明在 [docs/plugin.md](/Users/mac/Desktop/other/全栈/docs/plugin.md)
- 展示型 demo 流程包在 [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)

## 当前状态

这是一个可用的 `v0.3.0` 版本：

- 已有完整模板体系和三模式工作流
- 已有 `delivery-os CLI`
- 已有 repo-local Claude Code 插件
- 已有仓库级 issue/PR 自动化入口
- 已有 issue 驱动的 workspace 生成、健康检查和 GitHub 元数据初始化

下一阶段重点是：

- 把这套 CLI + 插件架构接进真实业务仓库
- 继续补业务仓库级 adapter 和更多真实样本

## 许可证

本仓库使用 [MIT License](/Users/mac/Desktop/other/全栈/LICENSE)。
