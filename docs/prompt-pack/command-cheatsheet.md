# Claude Code 命令清单

## 1. 需求与任务管理

```bash
gh issue list
gh issue view <issue-id>
gh project item-list <project-id>
gh pr status
gh pr checks
```

## 2. 开发环境与代码验证

```bash
pnpm install
pnpm lint
pnpm test
npx playwright test
docker ps
docker compose up -d
```

## 3. 外部工具接入

```bash
opencli list
opencli doctor
opencli daemon status
opencli gh pr list --limit 5
```

## 4. Claude Code 中的 CLI-Anything

```text
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything
/cli-anything /path/to/target
/cli-anything:refine /path/to/target
/cli-anything:test /path/to/target
/cli-anything:validate /path/to/target
```

## 5. 发布

```bash
vercel
vercel inspect <deployment-url>
vercel logs <deployment-url>
vercel --prod
```

## 6. 推荐执行顺序

1. 先读 issue、PRD、设计规格
2. 再跑项目本地测试与 lint
3. 编码完成后跑最小可靠验证
4. 提交 PR 前确认检查项与发布清单
