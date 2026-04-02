# Delivery OS

一套面向 Claude Code 的交付操作系统，用来把“想法 -> 规格 -> 开发 -> 验证 -> 发布 -> 反馈”变成可重复执行的流程。

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
3. 用 kickoff 脚本生成当前需求的最小文档包

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

如果不装 `pnpm`，也可以直接用：

```bash
node scripts/delivery-os/init.mjs --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

同步 GitHub labels：

```bash
pnpm labels:sync -- --repo <owner/repo>
```

## 推荐使用方式

1. 把这个仓库作为母版仓库持续演进
2. 在具体业务仓库里复制或同步模板、工作流和脚本
3. 每个业务仓库补自己的 `project-profile`、`system-map`、`iteration-log`

## GitHub 接入

- Issue 模板在 `.github/ISSUE_TEMPLATE/`
- PR 模板在 `.github/PULL_REQUEST_TEMPLATE.md`
- Labels 配置在 `.github/labels.json`
- GitHub Action 守门规则在 `.github/workflows/delivery-os-guardrails.yml`
- 仓库初始化与发布说明在 [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- 协作约束说明在 [docs/repo/collaboration-defaults.md](/Users/mac/Desktop/other/全栈/docs/repo/collaboration-defaults.md)

## 当前状态

这是一个可用的 `v2` 版本：

- 已有完整模板体系
- 已有三模式工作流
- 已有仓库级 issue/PR 入口
- 已有 issue 驱动的 kickoff 脚本
- 已有 labels 同步脚本、自动 kickoff 评论、artifact checklist、merge 后自动勾选产物项、iteration-log 提醒、guardrails workflow 和 workspace 示例

下一阶段重点是：

- 把这套规则接进真实业务仓库
- 让 issue -> kickoff -> 文档 -> 开发 -> 发布 形成默认路径
- 继续把反馈、监控、发布自动化接进来
