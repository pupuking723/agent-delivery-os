# CLI-Anything 适配套路

当目标系统有源码，但没有成熟 CLI，而且这套能力值得被复用时，才走这条路。

## 适用场景

- 有源码的内部工具
- agent 不好操作的开源项目
- 反复执行、值得收敛成命令面的流程

## 推荐起手

```bash
pnpm recipes cli-anything --title "需求标题"
```

然后重点补：

- `tool-interface-map.md`
- `implementation-plan.md`
- `task-breakdown.md`

## 推荐路径

1. 先确认没有更好的官方 CLI。
2. 梳理目标仓库、入口和鉴权要求。
3. 用 `CLI-Anything` 生成最小可用命令面。
4. 持续 refine，直到命令面稳定。
5. 至少用一条真实端到端流程验证它。

## 注意点

- GitHub、Vercel、Docker、Figma 不该走这条路。
- 目标已有成熟 CLI 时，不要重复造轮子。
- 必须明确这套 adapter 到底在解锁哪条工作流。
