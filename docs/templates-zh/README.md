# 中文模板索引

这套模板用于把需求到发布的流程标准化，适合直接在 Claude Code 工作流中使用。

## 模板清单

- `PRD.md`: 产品需求文档
- `design-spec.md`: 设计规格
- `implementation-plan.md`: 实现计划
- `task-breakdown.md`: 任务拆解
- `release-checklist.md`: 发布检查清单
- `tool-interface-map.md`: 外部工具、网页、桌面应用和开源项目的接口路由文档

## 推荐使用顺序

1. 先写 `PRD.md`
2. 再补 `design-spec.md`
3. 设计确认后写 `implementation-plan.md`
4. 落地执行时拆成 `task-breakdown.md`
5. 如果任务依赖外部系统或工具链，补 `tool-interface-map.md`
6. 上线前填写 `release-checklist.md`

## 使用建议

- 每个需求单独复制一套模板到对应功能目录
- 保留模板结构，优先填实内容，不要只写概念描述
- 每一份文档都尽量链接到上游文档和下游执行项
