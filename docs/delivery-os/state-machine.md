# Delivery State Machine

无论哪种模式，都沿用同一个状态机，只是阶段深度不同。

## 统一阶段

1. `Intake`
2. `Route`
3. `Spec`
4. `Plan`
5. `Build`
6. `Validate`
7. `Release`
8. `Learn`

## 阶段说明

### 1. Intake

收集输入：

- 用户需求
- 业务目标
- 现有代码或产品状态
- 时间和风险约束

输出：

- 问题陈述
- 假设
- 初步目标

### 2. Route

根据 `mode-router.md` 判断模式。

输出：

- 模式判定
- 判定依据
- 文档深度
- 立即需要补齐的文档

### 3. Spec

根据模式生成最小规格集。

输出示例：

- Flash Launch：
  `idea-brief + lean PRD`
- Product Iteration：
  `PRD + design-spec`
- Legacy Maintenance：
  `project-profile + system-map`

### 4. Plan

把规格变成可执行任务。

输出：

- `implementation-plan`
- `task-breakdown`
- 测试与发布策略

### 5. Build

实施改动。

要求：

- 范围内改动
- 尽量小步提交
- 同步更新必要文档

### 6. Validate

至少验证：

- 核心路径
- 边界情况
- 权限或安全影响
- 发布前必要检查

### 7. Release

至少覆盖：

- 部署命令
- Feature Flag 或灰度策略
- 回滚路径
- 上线后检查

### 8. Learn

上线后回流：

- 指标变化
- 用户反馈
- 问题和缺陷
- 下一轮优先级

输出：

- `iteration-log`

## 推进规则

- 未完成 `Route` 不能直接进入 `Build`
- 未形成最小规格集不能进入 `Plan`
- 未形成验证摘要不能进入 `Release`
- 上线后如果没有反馈记录，不能视为流程闭环
