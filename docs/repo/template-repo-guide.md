# Template Repository Guide

## 目标

把 `agent-delivery-os` 当成一个母版仓库，5 分钟内起一个新的业务交付仓库。

## 适合什么场景

- 你要从 0 到 1 起一个新项目
- 你要给现有产品团队统一交付入口
- 你要为多个仓库复用同一套 agent 工作流

## 最快路径

1. 在 GitHub 上点击 `Use this template`
2. 创建新的业务仓库
3. clone 新仓库到本地
4. 按你的项目实际情况补 `project-profile` 和 `system-map`
5. 先跑总入口命令把本地骨架和 GitHub 元数据一起补齐
6. 检查 issue/PR 模板和 Actions 是否启用

## 建仓后第一批必做项

- 更新仓库名、README 标题和仓库描述
- 更新 [CLAUDE.md](/Users/mac/Desktop/other/全栈/CLAUDE.md) 里的项目上下文规则
- 补你的业务项目入口：
  - `docs/project/project-profile.md`
  - `docs/project/system-map.md`
  - `docs/project/iteration-log.md`
- 确认默认 workspace 根目录
- 确认 GitHub Actions 在目标仓库可用

## 推荐初始化顺序

### 1. 设置仓库元数据

- description
- homepage
- topics
- visibility

### 2. 同步协作入口

- issue templates
- PR template
- labels
- workflow permissions

### 3. 建立项目上下文

- `project-profile`
- `system-map`
- `iteration-log`
- 如果是新项目，再从 `idea-brief` 或 `PRD` 起步

### 4. 试跑一条真实需求

优先选低风险需求，走完整链路：

- issue
- mode label
- kickoff
- workspace
- PR
- merge
- iteration-log

## 推荐命令

一条命令跑完整个第一层初始化：

```bash
pnpm bootstrap:all -- --project "新项目名" --repo-name "new-product-repo" --repo <owner/repo>
```

如果你只想跑本地骨架：

一键初始化业务仓库：

```bash
pnpm bootstrap:repo -- --project "新项目名" --repo-name "new-product-repo" --workspace-root "workspace"
```

如果你只想跑 GitHub 元数据：

一键初始化 GitHub 仓库元数据：

```bash
pnpm bootstrap:github -- --repo <owner/repo> --project "新项目名"
```

同步 labels：

```bash
pnpm labels:sync -- --repo <owner/repo>
```

按需求生成 workspace：

```bash
pnpm kickoff --title "团队邀请功能" --summary "已上线项目，需要新增邀请弹窗和角色分配"
```

按 issue 生成 workspace：

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

## 不要直接照搬的部分

下列内容应该按业务仓库重写，而不是直接复用：

- README 顶部定位
- 仓库 description
- 项目特有的 `project-profile`
- 项目特有的 `system-map`
- 真实发布流程与环境变量说明

## 成功标准

一个新的业务仓库至少要做到：

- 能用 issue form 发起需求
- 能根据 mode label 自动给出 kickoff comment
- 能生成稳定 workspace 路径
- 能在 PR 中绑定 `Workspace` 和 `Artifact paths`
- 能在 merge 后提醒补 `iteration-log`

## 相关入口

- [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
