import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

export const MODES = {
  flash: 'Flash Launch',
  product: 'Product Iteration',
  legacy: 'Legacy Maintenance',
}

export const ARTIFACTS = {
  flash: ['idea-brief', 'PRD', 'design-spec', 'implementation-plan', 'release-checklist'],
  product: ['project-profile', 'PRD', 'design-spec', 'implementation-plan', 'task-breakdown', 'release-checklist', 'iteration-log'],
  legacy: ['project-profile', 'system-map', 'implementation-plan', 'task-breakdown', 'release-checklist'],
}

export const PROJECT_ARTIFACTS = ['project-profile', 'system-map', 'iteration-log']
export const OPTIONAL_ARTIFACTS = ['tool-interface-map']
export const INTERFACE_MAP_KEYWORDS = [
  'opencli',
  'cli-anything',
  'website',
  'web app',
  'browser',
  'dashboard',
  'admin panel',
  'admin console',
  'electron',
  'desktop app',
  'desktop tool',
  'external tool',
  'external system',
  'source-available',
  'open source',
  'internal tool',
  'internal admin',
  'automation',
  'adapter',
  'integration',
  '网站',
  '网页',
  '浏览器',
  '后台',
  '管理后台',
  '桌面应用',
  '桌面工具',
  '外部工具',
  '外部系统',
  '源码可用',
  '开源项目',
  '自动化',
  '适配器',
  '集成',
]

export const MODE_KEYWORDS = {
  legacy: ['legacy', 'old project', 'handoff', 'vibe', 'maintenance', '接手', '老项目', '历史代码', '文档缺失', '维护'],
  flash: ['mvp', 'launch', 'idea', 'fast', 'validate', '抢市场', '快速上线', '验证想法', '最小可用'],
  product: ['iteration', 'feature', 'optimize', 'feedback', 'conversion', '新增功能', '新增', '优化', '迭代', '下一版本', '已上线', '上线产品'],
}

export const MODE_LABELS = new Set(['flash-launch', 'product-iteration', 'legacy-maintenance'])

export const MODE_MAP = {
  'flash-launch': 'flash',
  'product-iteration': 'product',
  'legacy-maintenance': 'legacy',
}

export const DEFAULT_TOPICS = [
  'delivery-os',
  'ai-agents',
  'workflow-automation',
  'product-development',
  'developer-tools',
]

export const REQUIRED_TOPICS = [
  'ai-agents',
  'workflow-automation',
  'product-development',
  'developer-tools',
]

export const COMMON_FILES = [
  'README.md',
  'README.en.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'SECURITY.md',
  'SUPPORT.md',
  'CODE_OF_CONDUCT.md',
  '.github/labels.json',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/workflows/delivery-os-guardrails.yml',
  '.github/ISSUE_TEMPLATE/flash-launch.yml',
  '.github/ISSUE_TEMPLATE/product-iteration.yml',
  '.github/ISSUE_TEMPLATE/legacy-maintenance.yml',
  'docs/playbook.md',
]

export const TEMPLATE_FILES = [
  'docs/repo/template-repo-guide.md',
  'docs/repo/github-setup.md',
  'scripts/bootstrap-all.mjs',
  'scripts/delivery-os/bootstrap-repo.mjs',
  'scripts/github/bootstrap-repo.mjs',
  'plugins/delivery-os/.codex-plugin/plugin.json',
  '.agents/plugins/marketplace.json',
]

export const BUSINESS_FILES = [
  'docs/project/README.md',
  'docs/project/bootstrap.json',
  'docs/project/project-profile.md',
  'docs/project/system-map.md',
  'docs/project/iteration-log.md',
]

export const REQUIRED_SCRIPTS = [
  'bootstrap:all',
  'bootstrap:repo',
  'bootstrap:github',
  'guide',
  'health:check',
  'kickoff',
  'kickoff:issue',
  'labels:sync',
  'recipes',
  'start:flow',
  'doctor',
]
