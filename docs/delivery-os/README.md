# Delivery OS

这是一套面向 Claude Code 的交付操作系统，用来把“想法 -> 规格 -> 开发 -> 验证 -> 发布 -> 反馈”变成可重复执行的流程。

## 目标

这套系统解决三类需求：

1. `Flash Launch`
   从 0 到 1，把一个想法尽快上线验证市场
2. `Product Iteration`
   从 1 到 100，持续迭代一个已经上线的产品
3. `Legacy Maintenance`
   维护和演进现有项目，包括人工代码和 vibe coding 项目

## 核心原则

- 同一套底盘，三种运行模式
- 先路由模式，再决定文档深度
- 风险越高，文档和验证越重
- 上线不是终点，必须把反馈带回下一轮迭代
- 优先让 Claude Code 按固定入口和固定产物执行
- 当任务依赖外部工具链时，要显式记录接口路由，而不是靠临时记忆

## 组成

- [mode-router.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/mode-router.md)
  用来判断当前请求属于哪种模式
- [artifact-matrix.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/artifact-matrix.md)
  定义不同模式下最少需要哪些文档
- [state-machine.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/state-machine.md)
  定义统一执行阶段和推进规则
- [flash-launch.md](/Users/mac/Desktop/other/全栈/docs/workflows/flash-launch.md)
- [product-iteration.md](/Users/mac/Desktop/other/全栈/docs/workflows/product-iteration.md)
- [legacy-maintenance.md](/Users/mac/Desktop/other/全栈/docs/workflows/legacy-maintenance.md)

## 执行顺序

1. 用路由规则判断当前模式
2. 根据模式确定文档深度
3. 生成或补齐最小必需文档
4. 进入实现、验证、发布
5. 更新反馈闭环文档

## 推荐入口

优先从以下入口开始：

- 项目画像：
  [project-profile.md](/Users/mac/Desktop/other/全栈/docs/templates-zh/project-profile.md)
- 0 到 1 想法收敛：
  [idea-brief.md](/Users/mac/Desktop/other/全栈/docs/templates-zh/idea-brief.md)
- 遗留项目梳理：
  [system-map.md](/Users/mac/Desktop/other/全栈/docs/templates-zh/system-map.md)
- 上线后闭环：
  [iteration-log.md](/Users/mac/Desktop/other/全栈/docs/templates-zh/iteration-log.md)
- 会话总控 prompt：
  [session-kickoff.md](/Users/mac/Desktop/other/全栈/docs/prompt-pack/session-kickoff.md)
- 工具接入地图：
  [tool-interface-map.md](/Users/mac/Desktop/other/全栈/docs/templates-zh/tool-interface-map.md)
- recipes 中文入口：
  [docs/recipes-zh/README.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/README.md)
- 仓库 kickoff 脚本：
  [init.mjs](/Users/mac/Desktop/other/全栈/scripts/delivery-os/init.mjs)
