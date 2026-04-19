# OpenCLI 自动化套路

当流程依赖网站、Electron、桌面工具，或者需要浏览器驱动动作时，优先走这条路。

## 适用场景

- 自动化后台网站
- 驱动没有官方 CLI 的 SaaS 面板
- 驱动 Electron 或桌面工具
- 把浏览器动作和本地代码修改放进同一条流程

## 推荐起手

```bash
pnpm recipes opencli --title "需求标题"
```

然后重点补这几个文件：

- `tool-interface-map.md`
- `implementation-plan.md`
- `release-checklist.md`

## 推荐路径

1. 在 `tool-interface-map.md` 里列出真实目标系统。
2. 记录真实 URL、鉴权状态和 `opencli` 命令。
3. 把浏览器动作和本地验证分开写清楚。
4. 把截图、日志、trace 当成验证证据。

## 注意点

- 不要把浏览器依赖藏在模糊描述里。
- 必须写清楚入口站点和登录前提。
- 要区分“环境没配好”和“产品逻辑出错”。
