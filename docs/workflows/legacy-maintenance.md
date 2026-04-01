# Legacy Maintenance Workflow

适用于维护老项目、接手项目、以及 vibe coding 项目。

## 目标

- 先理解，再修改
- 先建立安全边界，再迭代
- 用最小风险推进现有系统

## 最小产物

- `project-profile`
- `system-map`
- `implementation-plan`
- `task-breakdown`
- `release-checklist`

按需补充：

- `PRD`
- `design-spec`
- `iteration-log`

## 标准步骤

1. 建立 `project-profile`
2. 补 `system-map`
3. 明确高风险模块、关键路径、测试基线
4. 如果是新增功能，再补 `PRD` 和 `design-spec`
5. 生成 `implementation-plan`
6. 拆分成小步 `task-breakdown`
7. 小范围修改并验证
8. 按 `release-checklist` 发布
9. 将结果记录到 `iteration-log`

## 重点

- 绝不跳过系统梳理直接大改
- 一次只动一个清晰边界
- 先补最小测试基线
- 保留快速回滚能力

## 最小验证

- 被改动模块有最小测试覆盖
- 关键路径未回归
- 上下游依赖没有被破坏
- 发布后能快速发现异常

## 何时降级为 Product Iteration

满足任一条件时切换：

- 项目结构和关键风险已经清楚
- 测试基线已形成
- 团队已经可以稳定新增功能
