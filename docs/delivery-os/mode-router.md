# Mode Router

先判断模式，再开始执行。

## 模式定义

### 1. Flash Launch

适用场景：

- 你只有一个想法，想尽快上线验证
- 项目刚开始，没有完整产品和流程
- 时间比完美更重要

典型关键词：

- 快速上线
- 抢市场
- MVP
- 验证想法
- 先做最小可用版本

### 2. Product Iteration

适用场景：

- 产品已经上线
- 需要持续加功能、优化体验、提高指标
- 目标是长期把产品做强

典型关键词：

- 新增功能
- 优化转化
- 数据驱动
- 用户反馈
- 下一版本

### 3. Legacy Maintenance

适用场景：

- 项目已经存在，但上下文不完整
- 代码由人工、外包、AI 或 vibe coding 混合产生
- 改动前必须先看懂结构和风险

典型关键词：

- 老项目
- 接手维护
- 不敢改
- 文档缺失
- 历史代码
- vibe coding 项目

## 自动判断规则

按以下顺序判断：

1. 如果当前项目缺少清晰上下文，或者用户明确说是旧项目、接手项目、vibe coding 项目，优先判定为 `Legacy Maintenance`
2. 如果项目尚未上线，目标是尽快推出最小版本，判定为 `Flash Launch`
3. 如果项目已经上线，目标是持续新增功能或优化，判定为 `Product Iteration`
4. 如果同时满足多个条件，按更高风险模式处理：
   `Legacy Maintenance > Product Iteration > Flash Launch`

## 路由输出

每次开始新任务时，Claude Code 应明确输出：

- 当前模式
- 判定依据
- 需要补齐的最小文档
- 当前不需要做的重型步骤

## 禁止项

- 不要在 `Flash Launch` 模式下强行要求完整重型流程
- 不要在 `Legacy Maintenance` 模式下跳过系统梳理直接大改
- 不要在 `Product Iteration` 模式下忽略数据、反馈和回滚
