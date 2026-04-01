# Claude Code 命令清单与 Prompt 包

这套文件用于把 Claude Code 的执行动作标准化，减少每次从零组织 prompt 的成本。

## 内容

- `command-cheatsheet.md`: 常用命令清单
- `session-kickoff.md`: 会话总控与模式路由 prompt
- `prd-draft.md`: 起草 PRD 的标准 prompt
- `design-spec.md`: 起草设计规格的标准 prompt
- `implementation-plan.md`: 生成实现计划的标准 prompt
- `task-breakdown.md`: 生成执行任务拆解的标准 prompt
- `coding.md`: 编码执行 prompt
- `review.md`: 代码评审 prompt
- `qa-validation.md`: QA 与验证 prompt
- `release.md`: 发布执行 prompt

## 使用顺序

1. 先用文档类 prompt 起草需求和设计
2. 每次开始复杂任务时，优先先跑 `scripts/delivery-os/init.mjs`
3. 再用 `session-kickoff.md`
4. 再用计划类 prompt 生成实现计划和任务拆解
5. 编码时用 `coding.md`
6. 审查时用 `review.md`
7. 验证时用 `qa-validation.md`
8. 上线时用 `release.md`

## 原则

- 只把 prompt 当成骨架，不要盲目照抄
- 始终补齐范围、约束、验收标准、验证方式
- Prompt 必须引用上游文档，避免脱离上下文执行
