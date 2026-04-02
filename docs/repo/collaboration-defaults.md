# Collaboration Defaults

## 仓库默认协作面

这个仓库建议把以下入口作为默认协作约束：

- Issue 必须从三种模式模板之一发起
- PR 必须显式写出 `Mode`、`Scope`、`Validation`
- 标签必须至少有一个模式标签
- 自动化或脚本改动，必须带 `automation`
- 模板改动，必须带 `templates`

## 模式标签

- `flash-launch`
- `product-iteration`
- `legacy-maintenance`

## 辅助标签

- `docs`
- `automation`
- `templates`
- `prompt-pack`
- `workflow`

## 推荐规则

- 新 issue 创建后，先补模式标签
- kickoff 生成的 workspace 目录应该在 issue 或 PR 里可追踪
- 修改 `CLAUDE.md` 时，应同步检查 `docs/delivery-os/`
- 修改脚本时，应至少给一个 dry run 或实跑结果
- PR 会由 `.github/workflows/delivery-os-guardrails.yml` 检查模式标签和基础字段
- PR 应显式填写 `Workspace` 和 `Artifact paths`
- issue 带上模式标签后，仓库会自动评论对应的 kickoff 命令
- issue 带上模式标签后，仓库还会自动生成一条按模式匹配的 artifact checklist 评论
- PR 合并后，仓库会自动提醒补 `iteration-log.md`
