# Artifact Matrix

这个矩阵定义不同模式下的最小文档深度。目标不是追求文档最多，而是让当前模式足够安全、足够快。

## 统一文档池

- `idea-brief`
- `PRD`
- `design-spec`
- `implementation-plan`
- `task-breakdown`
- `release-checklist`
- `project-profile`
- `system-map`
- `iteration-log`

## Flash Launch

最小必需：

- `idea-brief`
- 轻量 `PRD`
- 轻量 `design-spec`
- `implementation-plan`
- `release-checklist`

按需补充：

- `task-breakdown`
  当任务超过一个 PR、多人协作、或风险中等以上时再补
- `iteration-log`
  上线后必须补第一条反馈记录

可跳过：

- `system-map`
  除非已经有老代码基础

## Product Iteration

最小必需：

- `project-profile`
- `PRD`
- `design-spec`
- `implementation-plan`
- `task-breakdown`
- `release-checklist`
- `iteration-log`

按需补充：

- `idea-brief`
  当需求来源还很模糊时先写
- `system-map`
  当涉及高风险模块或跨系统改动时补

## Legacy Maintenance

最小必需：

- `project-profile`
- `system-map`
- `implementation-plan`
- `task-breakdown`
- `release-checklist`

按需补充：

- `PRD`
  当是新增功能或行为变更时补
- `design-spec`
  当涉及明显 UI/UX 变更时补
- `iteration-log`
  上线或修复后必须记录

## 文档深度规则

### 轻量

适用于：

- 小团队
- 快速验证
- 风险低
- 需求明确

要求：

- 范围清楚
- 验收标准清楚
- 发布和回滚路径清楚

### 标准

适用于：

- 已上线产品
- 功能增强
- 中风险改动

要求：

- 功能、设计、任务、验证完整
- 有明确的负责人和上线检查

### 重型

适用于：

- 遗留高风险系统
- 核心交易或关键主流程
- 大范围结构调整

要求：

- 必须补系统地图
- 必须补风险说明
- 必须补测试基线和回滚计划
