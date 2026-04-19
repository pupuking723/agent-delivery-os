# Delivery OS Recipes 中文入口

这些 recipes 用来告诉你，如何把 Delivery OS 当成“能力编排层”来用，而不只是文档生成器。

## 选择一条套路

- [official-cli-delivery.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/official-cli-delivery.md)
  适合目标系统已经有成熟官方 CLI 的情况。
- [opencli-automation.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/opencli-automation.md)
  适合要操作网站、Electron、桌面工具或浏览器驱动流程的情况。
- [cli-anything-adapter.md](/Users/mac/Desktop/other/delivery-os/docs/recipes-zh/cli-anything-adapter.md)
  适合目标有源码但没有成熟 CLI，需要补一个可复用命令面的情况。

## 统一原则

- 优先官方 CLI。
- 需要网站或桌面动作时用 `opencli`。
- 只有目标缺成熟 CLI 且源码可用时，才用 `CLI-Anything`。
- 只要请求依赖外部工具，优先生成带 `tool-interface-map.md` 的 workspace。

## 推荐起手

```bash
pnpm recipes
pnpm recipes opencli --title "需求标题"
```
