# 官方 CLI 交付套路

当目标系统已经有成熟 CLI 时，优先走这条路。

## 适用场景

- 用 `gh` 管 GitHub 工作流
- 用 `vercel` 管发布和环境
- 用 `docker` 管本地服务或容器
- 用项目脚本或 Playwright 跑验证

## 为什么优先这条路

这是默认路径。既然官方 CLI 已经可用，就不要额外造 adapter。

## 推荐路径

1. 先用 `delivery-os init` 初始化仓库。
2. 用 `delivery-os feature` 为需求起 workspace。
3. 补 `project-profile.md`、`implementation-plan.md`、`release-checklist.md`。
4. 直接用真实 CLI 跑开发、验证和发布。
5. 记录验证结果和回滚路径。

## 常见命令面

```bash
gh issue view <number> --repo <owner/repo>
gh pr create
gh pr checks
pnpm lint
pnpm test
npx playwright test
vercel
vercel --prod
```
