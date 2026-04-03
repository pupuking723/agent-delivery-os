import { createProjectBootstrap, printProjectBootstrapResult } from './bootstrap-repo.mjs'
import { bootstrapGitHubRepo, printBootstrapGitHubResult } from './github.mjs'

export function runBootstrapAll(args) {
  const skipRepo = Boolean(args['skip-repo'])
  const skipGitHub = Boolean(args['skip-github'])

  if (skipRepo && skipGitHub)
    throw new Error('Nothing to do: both --skip-repo and --skip-github were provided.')

  const forwarded = { ...args }
  delete forwarded['skip-repo']
  delete forwarded['skip-github']

  if (!skipRepo)
    printProjectBootstrapResult(createProjectBootstrap(forwarded))

  if (!skipGitHub)
    printBootstrapGitHubResult(bootstrapGitHubRepo(forwarded))
}
