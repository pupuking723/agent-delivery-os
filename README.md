# Delivery OS

[![Release](https://img.shields.io/github/v/release/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/releases/latest)
[![License](https://img.shields.io/github/license/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/blob/main/LICENSE)

[English README](./README.en.md)

> Agent-first delivery operating system for repeatable product execution.

一套面向 Claude Code 与 agent 工作流的交付操作系统，用来把：

`idea -> spec -> implementation -> validation -> release -> feedback`

变成可复用、可协作、可自动推进的仓库路径。

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

## Why This Repo

- 它不是单纯模板仓库，而是带有 GitHub 自动化的交付母版仓库
- 它不只管“开始做”，也管“怎么验证、怎么发布、怎么回写结果”
- 它既能给你个人使用，也能迁移到真实业务仓库里做团队协作入口

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

1. 先读 [docs/delivery-os/README.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/README.md)
2. 再读 [CLAUDE.md](/Users/mac/Desktop/other/全栈/CLAUDE.md)
3. 如果这是新业务仓库，先跑一遍 bootstrap
4. 再用 kickoff 脚本生成当前需求的最小文档包

```bash
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
```

```bash
pnpm bootstrap:repo -- --project "新项目名" --repo-name "new-product-repo" --workspace-root "workspace"
```

```bash
pnpm bootstrap:github -- --repo <owner/repo> --project "新项目名"
```

```bash
pnpm doctor -- --repo <owner/repo>
```

```bash
pnpm kickoff --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

从 GitHub issue 直接生成 workspace：

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

如果 issue 已经带上模式标签，仓库会自动评论这条命令。
同时也会自动生成一条按模式整理的 artifact checklist 评论。
PR 合并后，仓库还会自动提醒补 `iteration-log.md`。
PR 本身也应显式填写 `Workspace` 和 `Artifact paths`，把代码变更和交付产物绑定起来。
如果 `Artifact paths` 填得准确，issue checklist 会在 PR 合并后自动勾掉对应产物项。
默认 workspace 路径会稳定落到 `workspace/<issue-number>-<slug>`。
如果 issue form 里填写了 `Workspace 根目录`，默认路径会变成 `<workspace-root>/<issue-number>-<slug>`。
如果你刚从 template 仓库创建了一个新业务仓库，优先跑 `pnpm bootstrap:all`。

如果不装 `pnpm`，也可以直接用：

```bash
node scripts/delivery-os/init.mjs --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

同步 GitHub labels：

```bash
pnpm labels:sync -- --repo <owner/repo>
```

检查仓库健康状态：

```bash
pnpm doctor -- --repo <owner/repo>
```

如果你只想先看一条完整示例，直接从这里开始：

- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
- [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)

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
- 展示型 demo 流程包在 [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)

## 当前状态

这是一个可用的 `v2` 版本：

- 已有完整模板体系
- 已有三模式工作流
- 已有仓库级 issue/PR 入口
- 已有 issue 驱动的 kickoff 脚本
- 已有 labels 同步脚本、自动 kickoff 评论、artifact checklist、merge 后自动勾选产物项、iteration-log 提醒、guardrails workflow 和 workspace 示例
- issue form 也已经支持 `项目代号` 和 `Workspace 根目录`

下一阶段重点是：

- 把这套规则接进真实业务仓库
- 让 issue -> kickoff -> 文档 -> 开发 -> 发布 形成默认路径
- 继续把反馈、监控、发布自动化接进来

## 许可证

本仓库使用 [MIT License](/Users/mac/Desktop/other/全栈/LICENSE)。
