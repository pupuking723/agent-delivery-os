import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_TOPICS, ROOT } from './config.mjs'
import { inferRepoFromOrigin, runProcess, toList } from './utils.mjs'

export function syncLabels(args) {
  const repo = args.repo
  if (!repo)
    throw new Error('Missing required argument: --repo <owner/name>')

  const labelsPath = join(ROOT, '.github', 'labels.json')
  const labels = JSON.parse(readFileSync(labelsPath, 'utf-8'))
  for (const label of labels) {
    runProcess('gh', [
      'label',
      'create',
      label.name,
      '--repo',
      repo,
      '--color',
      label.color,
      '--description',
      label.description,
      '--force',
    ], { dryRun: Boolean(args['dry-run']), inherit: !Boolean(args['dry-run']) })
  }

  return {
    repo,
    labels: labels.map(label => label.name),
  }
}

export function printSyncLabelsResult(result) {
  console.log(`Repository: ${result.repo}`)
  console.log('Labels:')
  for (const label of result.labels)
    console.log(`- ${label}`)
}

export function bootstrapGitHubRepo(args) {
  const dryRun = Boolean(args['dry-run'])
  const repo = args.repo || inferRepoFromOrigin()
  if (!repo)
    throw new Error('Missing repository. Use --repo <owner/name> or configure remote.origin.url.')

  const project = args.project || repo.split('/')[1] || 'new-product-repo'
  const description = args.description || `Delivery OS-enabled repository for ${project}.`
  const homepage = args.homepage || `https://github.com/${repo}/blob/main/docs/playbook.md`
  const topics = toList(args.topic || args.topics, DEFAULT_TOPICS)
  const syncLabelsEnabled = !args['skip-labels']

  const editArgs = [
    'repo',
    'edit',
    repo,
    '--description',
    description,
    '--homepage',
    homepage,
    '--enable-issues',
  ]

  for (const topic of topics)
    editArgs.push('--add-topic', topic)

  runProcess('gh', editArgs, { dryRun })

  if (syncLabelsEnabled)
    syncLabels({ repo, 'dry-run': dryRun })

  return {
    repo,
    description,
    homepage,
    topics,
    labelsSynced: syncLabelsEnabled,
  }
}

export function printBootstrapGitHubResult(result) {
  console.log(`Repository: ${result.repo}`)
  console.log(`Description: ${result.description}`)
  console.log(`Homepage: ${result.homepage}`)
  console.log(`Topics: ${result.topics.join(', ')}`)
  console.log(`Labels synced: ${result.labelsSynced ? 'yes' : 'no'}`)
}
