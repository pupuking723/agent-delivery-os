# Product Iteration Workflow

适用于已经上线的产品持续迭代。

## 目标

- 提高产品质量和用户价值
- 控制迭代节奏和发布风险
- 把数据和反馈带回下一轮开发

## 最小产物

- `project-profile`
- `PRD`
- `design-spec`
- `implementation-plan`
- `task-breakdown`
- `release-checklist`
- `iteration-log`

## 标准步骤

1. 从数据、用户反馈、Bug、运营、销售中收集问题
2. 更新或核对 `project-profile`
3. 写 `PRD`
4. 写 `design-spec`
5. 生成 `implementation-plan`
6. 拆成 `task-breakdown`
7. 开发、测试、评审
8. 按 `release-checklist` 发布
9. 把结果和反馈写入 `iteration-log`

## 重点

- 优先级管理
- Feature Flag
- 回滚能力
- 指标和反馈闭环

## 最小验证

- 自动化测试通过
- 关键用户路径验证通过
- 发布前检查完成
- 发布后指标与日志已确认

## 何时升级为 Legacy Maintenance

满足任一条件时切换：

- 项目上下文严重缺失
- 核心模块不敢修改
- 历史代码来源复杂
- 改动前需要先做逆向梳理
