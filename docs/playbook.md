# Delivery OS Playbook

这份 playbook 展示一条真实的端到端路径：

`新建 issue -> 标模式 -> 生成 workspace -> 填文档 -> 开 PR -> 合并 -> 补 iteration-log`

目标不是解释所有概念，而是告诉你这套系统在仓库里应该怎么跑。

如果你想看一份已经整理好的展示样本，直接看：

- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)

## 适用场景

- 你要在这个仓库里演练 Delivery OS
- 你准备把这套流程迁移到业务仓库
- 你想让别人照着一条标准路径快速上手

## 0. 前置条件

- 你已经能访问 GitHub 仓库
- `gh auth status` 正常
- 本地可运行 `node` 或 `pnpm`
- 仓库已启用：
  - issue templates
  - labels
  - `Delivery OS Guardrails`

## 1. 新建 Issue

在 GitHub 上从三种模板里选一个：

- `Flash Launch`
- `Product Iteration`
- `Legacy Maintenance`

建议至少填这些字段：

- `项目代号`
- `Workspace 根目录`
- 目标、范围、验证方式

示例：

- 项目代号：`airi-web`
- Workspace 根目录：`client-workspaces`

## 2. 确认模式标签

issue 创建后要确认它带了正确的模式标签：

- `flash-launch`
- `product-iteration`
- `legacy-maintenance`

如果标签缺失，机器人会评论提示你补标签。  
如果标签正确，机器人会自动评论：

- 一条 kickoff 命令
- 一条 artifact checklist

## 3. 生成 Workspace

优先直接使用机器人评论里的命令。

示例：

```bash
pnpm kickoff:issue -- --repo pupuking723/agent-delivery-os --issue 34 --out client-workspaces/34-团队邀请功能二期
```

如果你不传 `--out`，脚本也会默认生成稳定路径：

```bash
workspace/<issue-number>-<slug>
```

如果 issue form 里填了 `Workspace 根目录`，默认路径会变成：

```bash
<workspace-root>/<issue-number>-<slug>
```

生成后，目录里至少会有：

- `README.md`
- `kickoff.json`
- `next-steps.md`
- 模式要求的最小文档包

## 4. 填写最小文档

根据模式补齐最少必需文档。

### Flash Launch

至少补：

- `idea-brief.md`
- `PRD.md`
- `design-spec.md`
- `implementation-plan.md`
- `release-checklist.md`

### Product Iteration

至少补：

- `project-profile.md`
- `PRD.md`
- `design-spec.md`
- `implementation-plan.md`
- `task-breakdown.md`
- `release-checklist.md`
- `iteration-log.md`

### Legacy Maintenance

至少补：

- `project-profile.md`
- `system-map.md`
- `implementation-plan.md`
- `task-breakdown.md`
- `release-checklist.md`

## 5. 开始实现

编码前，先把文档路径和 workspace 路径记下来，因为 PR 会用到。

建议最少记录：

- workspace 路径
- 本轮实际补过的 artifact 路径

## 6. 开 PR

PR 描述里至少要填：

- `Mode`
- `Why`
- `Scope`
- `Workspace`
- `Artifact paths`
- `Risk level`

示例：

```md
## Summary

- Mode: Product Iteration
- Why: improve invite workflow for live product
- Scope: add invite role assignment and release checks
- Workspace: client-workspaces/34-团队邀请功能二期
- Artifact paths: client-workspaces/34-团队邀请功能二期/PRD.md, client-workspaces/34-团队邀请功能二期/implementation-plan.md, client-workspaces/34-团队邀请功能二期/task-breakdown.md

## Risks

- Risk level: medium
- Rollback: revert invite flow PR
- Follow-up: update iteration-log after merge
```

如果这些字段缺失，`Delivery OS Guardrails` 会拦下。

## 7. 合并后会发生什么

如果 PR 带了模式标签并成功 merge：

- PR 下会收到 `iteration-log` 提醒
- 如果 PR body 引用了 issue 编号，例如 `#34`
  issue 下也会收到 merge 后提醒
- 如果 `Artifact paths` 填得正确
  issue checklist 里的对应产物项会被自动勾掉

## 8. 补 Iteration Log

对以下情况，建议 merge 后尽快补：

- `Flash Launch`
- `Product Iteration`
- `Legacy Maintenance` 但改动已经上线或影响 runtime

最少补这几项：

- 改了什么
- 为什么改
- 结果如何
- 指标或观察
- 下一步动作

## 9. 推荐最小命令集

```bash
gh issue view <number> --repo <owner/repo>
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
gh pr create
gh pr checks
```

## 10. 常见错误

- issue 没有模式标签
  结果：不会进入正确自动化路径

- PR 没写 `Workspace`
  结果：guardrails 失败

- PR 没写 `Artifact paths`
  结果：guardrails 失败，merge 后也无法自动勾 checklist

- `Artifact paths` 乱写成自然语言
  结果：自动勾选不会生效

- merge 后没补 `iteration-log`
  结果：闭环断掉，下一轮迭代上下文会变差

## 11. 一句话原则

让每条需求都有：

- 可路由的模式
- 可定位的 workspace
- 可检查的 artifact
- 可追踪的验证
- 可回写的迭代结果
