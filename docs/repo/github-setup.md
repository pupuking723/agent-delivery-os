# GitHub Setup

## 目标

把这个目录整理成一个适合长期迭代的独立仓库。

## 本地初始化

如果目录还不是 Git 仓库：

```bash
git init -b main
git status
```

## 创建远程仓库

先决定两个问题：

1. 仓库名
2. 是 `public` 还是 `private`

如果用 GitHub CLI：

```bash
gh repo create <repo-name> --source=. --private --push
```

公开仓库可改成：

```bash
gh repo create <repo-name> --source=. --public --push
```

## 建议仓库配置

- 默认分支：`main`
- 启用 issue
- 启用 PR 模板
- 打开 branch protection
- 打开 discussions

## 建议标签

标签定义已经放在：

- [.github/labels.json](/Users/mac/Desktop/other/全栈/.github/labels.json)

同步到 GitHub：

```bash
pnpm labels:sync -- --repo <owner/repo>
```

## 发布前检查

- `README.md` 已说明仓库定位
- `CONTRIBUTING.md` 已说明协作规则
- `CLAUDE.md` 已说明 Claude Code 执行规则
- `.github/ISSUE_TEMPLATE/` 与 `.github/PULL_REQUEST_TEMPLATE.md` 已就位
- `.github/labels.json` 已就位并已同步到远端
- `.github/workflows/delivery-os-guardrails.yml` 已启用
- PR 模板已要求填写 `Workspace` 与 `Artifact paths`
- `scripts/delivery-os/init.mjs` 可生成最小文档包
- `scripts/delivery-os/from-issue.mjs` 可从 issue 生成 workspace
- issue 在带上模式标签后会收到自动 kickoff 评论
- issue 在带上模式标签后会收到自动 artifact checklist 评论
- PR 合并后会收到自动 iteration-log 提醒
- `examples/` 已提供 workspace 示例

## 许可证建议

如果你准备公开这个仓库，再补许可证：

- 想让别人宽松使用：`MIT`
- 想保留专利授权和更完整声明：`Apache-2.0`
- 只想自己或团队内部使用：先保持私有，不必急着加公开许可证
