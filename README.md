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

## 快速开始

1. 先读 [docs/delivery-os/README.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/README.md)
2. 再读 [CLAUDE.md](/Users/mac/Desktop/other/全栈/CLAUDE.md)
3. 用 kickoff 脚本生成当前需求的最小文档包

```bash
pnpm kickoff --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

如果不装 `pnpm`，也可以直接用：

```bash
node scripts/delivery-os/init.mjs --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗、角色分配和发布检查"
```

## 推荐使用方式

1. 把这个仓库作为母版仓库持续演进
2. 在具体业务仓库里复制或同步模板、工作流和脚本
3. 每个业务仓库补自己的 `project-profile`、`system-map`、`iteration-log`

## GitHub 接入

- Issue 模板在 `.github/ISSUE_TEMPLATE/`
- PR 模板在 `.github/PULL_REQUEST_TEMPLATE.md`
- 仓库初始化与发布说明在 [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)

## 当前状态

这是一个可用的 `v1.5` 版本：

- 已有完整模板体系
- 已有三模式工作流
- 已有仓库级 issue/PR 入口
- 已有 kickoff 脚本骨架

下一阶段重点是：

- 把这套规则接进真实业务仓库
- 让 issue -> kickoff -> 文档 -> 开发 -> 发布 形成默认路径
- 继续把反馈、监控、发布自动化接进来

