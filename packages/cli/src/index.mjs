import { runBootstrapAll } from '../../core/src/bootstrap-all.mjs'
import { createProjectBootstrap, printProjectBootstrapResult } from '../../core/src/bootstrap-repo.mjs'
import { printDoctorReport, runDoctor } from '../../core/src/doctor.mjs'
import { bootstrapGitHubRepo, printBootstrapGitHubResult, printSyncLabelsResult, syncLabels } from '../../core/src/github.mjs'
import { createWorkspace, createWorkspaceFromIssue, printWorkspaceFromIssueResult, printWorkspaceResult } from '../../core/src/kickoff.mjs'
import { parseArgs } from '../../core/src/utils.mjs'

function printHelp() {
  console.log(`delivery-os

Commands:
- init              bootstrap local repo + GitHub repo
- feature           create a workspace from a request
- issue             create a workspace from a GitHub issue
- check             run repository health checks
- labels            sync GitHub labels
- bootstrap-repo    bootstrap only docs/project and workspace root
- bootstrap-github  bootstrap only GitHub metadata and labels
- bootstrap-all     alias of init
`)
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  const args = parseArgs(rest)

  try {
    switch (command) {
      case 'init':
      case 'bootstrap-all':
        runBootstrapAll(args)
        return
      case 'feature':
        printWorkspaceResult(createWorkspace(args))
        return
      case 'issue':
        printWorkspaceFromIssueResult(createWorkspaceFromIssue(args))
        return
      case 'check':
      case 'doctor':
        printDoctorReport(runDoctor(args))
        return
      case 'labels':
        printSyncLabelsResult(syncLabels(args))
        return
      case 'bootstrap-repo':
        printProjectBootstrapResult(createProjectBootstrap(args))
        return
      case 'bootstrap-github':
        printBootstrapGitHubResult(bootstrapGitHubRepo(args))
        return
      default:
        throw new Error(`Unknown command: ${command}`)
    }
  }
  catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
