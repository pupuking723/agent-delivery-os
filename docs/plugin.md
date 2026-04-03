# Plugin Guide

## 结论

`agent-delivery-os` 现在采用：

- `delivery-os CLI`
- `Claude Code plugin`

CLI 是核心，插件只是入口层。

## 为什么不是只做插件

如果只做插件，会把能力绑死在 Claude Code。
CLI 更适合做：

- 仓库初始化
- workspace 生成
- 健康检查
- GitHub 元数据配置

插件则更适合做：

- Claude Code 内的低摩擦入口
- 更短的命令心智
- 更自然的工作流引导

## 当前插件位置

- [plugins/delivery-os/.codex-plugin/plugin.json](/Users/mac/Desktop/other/全栈/plugins/delivery-os/.codex-plugin/plugin.json)
- [plugins/delivery-os/skills/delivery-os/SKILL.md](/Users/mac/Desktop/other/全栈/plugins/delivery-os/skills/delivery-os/SKILL.md)
- [.agents/plugins/marketplace.json](/Users/mac/Desktop/other/全栈/.agents/plugins/marketplace.json)

## 插件实际做什么

插件不重复实现 Delivery OS 逻辑。
它只把 Claude Code 的入口映射到 CLI：

- `delivery-os init`
- `delivery-os feature`
- `delivery-os issue`
- `delivery-os check`

## 关于 CLI-Anything 和 OpenCLI

它们不是这套系统的硬依赖。

更合理的关系是：

- Delivery OS：交付编排核心
- `CLI-Anything`：可选的 non-CLI system adapter
- `OpenCLI`：可选的网站 / 桌面工具 adapter

也就是说：

没有这两个工具，Delivery OS 也能正常工作。
只有当目标仓库真的要操作外部系统时，才需要把它们接进来。
