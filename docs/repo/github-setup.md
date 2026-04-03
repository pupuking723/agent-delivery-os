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
- 如果准备作为母版仓库复用，打开 GitHub template repository

## 推荐自动化初始化

优先用总入口：

```bash
pnpm bootstrap:all -- --project "<项目名>" --repo-name "<repo-name>" --repo <owner/repo>
```

如果你要拆开执行，也可以：

先生成项目上下文：

```bash
pnpm bootstrap:repo -- --project "<项目名>" --repo-name "<repo-name>" --workspace-root "workspace"
```

再配置 GitHub 元数据：

```bash
pnpm bootstrap:github -- --repo <owner/repo> --project "<项目名>"
```

最后跑健康检查：

```bash
pnpm health:check -- --repo <owner/repo>
```

## 建议标签

标签定义已经放在：

- [.github/labels.json](/Users/mac/Desktop/other/全栈/.github/labels.json)

同步到 GitHub：

```bash
pnpm labels:sync -- --repo <owner/repo>
```

## 发布前检查

- `pnpm bootstrap:repo -- --project "<项目名>" --repo-name "<repo-name>"` 可生成 `docs/project/` 起始包
- `README.md` 已说明仓库定位
- `CONTRIBUTING.md` 已说明协作规则
- `CLAUDE.md` 已说明 Claude Code 执行规则
- `.github/ISSUE_TEMPLATE/` 与 `.github/PULL_REQUEST_TEMPLATE.md` 已就位
- `.github/labels.json` 已就位并已同步到远端
- `.github/workflows/delivery-os-guardrails.yml` 已启用
- PR 模板已要求填写 `Workspace` 与 `Artifact paths`
- `scripts/delivery-os/init.mjs` 可生成最小文档包
- `scripts/delivery-os/from-issue.mjs` 可从 issue 生成 workspace
- issue form 可填写 `项目代号` 与 `Workspace 根目录`
- issue 在带上模式标签后会收到自动 kickoff 评论
- issue 在带上模式标签后会收到自动 artifact checklist 评论
- PR 合并后会按 `Artifact paths` 自动更新 artifact checklist
- PR 合并后会收到自动 iteration-log 提醒
- issue 驱动的 workspace 默认路径为 `workspace/<issue-number>-<slug>`
- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md) 已提供端到端使用范例
- `examples/` 已提供 workspace 示例
- [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md) 已提供模板仓库落地说明

## 许可证建议

如果你准备公开这个仓库，再补许可证：

- 想让别人宽松使用：`MIT`
- 想保留专利授权和更完整声明：`Apache-2.0`
- 只想自己或团队内部使用：先保持私有，不必急着加公开许可证
