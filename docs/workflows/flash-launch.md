# Flash Launch Workflow

适用于从 0 到 1 的快速上线。

## 目标

- 尽快做出最小可用版本
- 尽快验证市场
- 尽量控制明显技术债和发布风险

## 最小产物

- `idea-brief`
- 轻量 `PRD`
- 轻量 `design-spec`
- `implementation-plan`
- `release-checklist`

## 标准步骤

1. 把想法写成 `idea-brief`
2. 只保留最关键需求，生成轻量 `PRD`
3. 只写核心流程和状态，生成轻量 `design-spec`
4. 写 `implementation-plan`
5. 如果任务过大，再补 `task-breakdown`
6. 开发最小闭环
7. 跑核心路径验证
8. 先 preview，再生产上线
9. 把用户反馈写入 `iteration-log`

## 重点

- 不做过早优化
- 不做过早抽象
- 优先实现可上线闭环
- 必须保留回滚能力

## 最小验证

- 核心路径能跑通
- 关键错误态可解释
- 部署成功
- 上线后可观测

## 何时升级为 Product Iteration

满足任一条件时切换：

- 产品已经上线并有真实用户
- 需求开始来自数据和反馈而不只是想法
- 同时存在多个待排优先级功能
- 发布开始需要灰度、监控和更稳定的节奏
