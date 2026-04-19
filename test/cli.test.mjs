import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { main } from '../packages/cli/src/index.mjs'

function captureOutput(fn) {
  const logs = []
  const errors = []
  const originalLog = console.log
  const originalError = console.error

  console.log = (...args) => {
    logs.push(args.join(' '))
  }
  console.error = (...args) => {
    errors.push(args.join(' '))
  }

  try {
    fn()
  }
  finally {
    console.log = originalLog
    console.error = originalError
  }

  return {
    stdout: logs.join('\n'),
    stderr: errors.join('\n'),
  }
}

test('recipes help prints recipe scaffolding usage', () => {
  const output = captureOutput(() => {
    main(['recipes', 'help'])
  })

  assert.match(output.stdout, /Recipe scaffolding/)
  assert.match(output.stdout, /delivery-os recipes opencli --title "Workflow title"/)
})

test('recipes opencli scaffolds a starter workspace in dry-run mode', () => {
  const output = captureOutput(() => {
    main(['recipes', 'opencli', '--title', 'Admin website automation', '--dry-run'])
  })

  assert.match(output.stdout, /Recipe: OpenCLI Automation/)
  assert.match(output.stdout, /Optional artifacts:/)
  assert.match(output.stdout, /tool-interface-map \(explicit flag\)/)
  assert.match(output.stdout, /Continue from .*implementation-plan\.md/)
})

test('recipes official-cli keeps interface map off by default', () => {
  const output = captureOutput(() => {
    main(['recipes', 'official-cli', '--title', 'Ship with gh and vercel', '--dry-run'])
  })

  assert.match(output.stdout, /Recipe: Official CLI/)
  assert.doesNotMatch(output.stdout, /Optional artifacts:/)
  assert.doesNotMatch(output.stdout, /tool-interface-map/)
})

test('check help prints usage instead of running doctor', () => {
  const output = captureOutput(() => {
    main(['check', '--help'])
  })

  assert.match(output.stdout, /Doctor \/ check/)
  assert.match(output.stdout, /--check-toolchain/)
  assert.doesNotMatch(output.stdout, /Doctor passed\./)
})

test('start auto-selects opencli for browser-heavy requests', () => {
  const output = captureOutput(() => {
    main(['start', '--title', 'Admin website automation', '--summary', 'Use browser actions on an admin dashboard', '--dry-run'])
  })

  assert.match(output.stdout, /Start route: OpenCLI Automation/)
  assert.match(output.stdout, /Selection reason: matched recipe keyword: (browser|dashboard|website)/)
})

test('start defaults to official-cli for generic requests', () => {
  const output = captureOutput(() => {
    main(['start', '--title', 'Ship release notes', '--summary', 'Publish a simple product update', '--dry-run'])
  })

  assert.match(output.stdout, /Start route: Official CLI/)
  assert.match(output.stdout, /Selection reason: (detected GitHub repository context|defaulted to official-cli for the lowest-friction path)/)
})

test('start can use repo context when the request text is generic', () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'delivery-os-start-context-'))
  const previousCwd = process.cwd()

  try {
    writeFileSync(path.join(tempDir, 'package.json'), `${JSON.stringify({
      name: 'context-test',
      scripts: {
        automate: 'opencli doctor',
      },
    }, null, 2)}\n`)
    mkdirSync(path.join(tempDir, 'workspace', 'browser-ops'), { recursive: true })
    writeFileSync(path.join(tempDir, 'workspace', 'browser-ops', 'tool-interface-map.md'), '# Tool Interface Map\n\nopencli doctor\n')

    process.chdir(tempDir)
    const output = captureOutput(() => {
      main(['start', '--title', 'Handle operations request', '--summary', 'Run the existing workflow', '--dry-run'])
    })

    assert.match(output.stdout, /Start route: OpenCLI Automation/)
    assert.match(output.stdout, /Selection reason: matched repo\/workspace signal: opencli/)
  }
  finally {
    process.chdir(previousCwd)
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('start keeps explicit recipe override above repo context', () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'delivery-os-start-explicit-'))
  const previousCwd = process.cwd()

  try {
    writeFileSync(path.join(tempDir, 'package.json'), `${JSON.stringify({
      name: 'context-test',
      scripts: {
        automate: 'opencli doctor',
      },
    }, null, 2)}\n`)

    process.chdir(tempDir)
    const output = captureOutput(() => {
      main(['start', '--recipe', 'official-cli', '--title', 'Handle operations request', '--summary', 'Run the existing workflow', '--dry-run'])
    })

    assert.match(output.stdout, /Start route: Official CLI/)
    assert.match(output.stdout, /Selection reason: explicit recipe: official-cli/)
  }
  finally {
    process.chdir(previousCwd)
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('recipes opencli prefills implementation plan and interface map', () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'delivery-os-recipe-'))

  try {
    captureOutput(() => {
      main(['recipes', 'opencli', '--title', 'Admin website automation', '--out', tempDir, '--force'])
    })

    const implementationPlan = readFileSync(path.join(tempDir, 'implementation-plan.md'), 'utf-8')
    const interfaceMap = readFileSync(path.join(tempDir, 'tool-interface-map.md'), 'utf-8')
    const taskBreakdown = readFileSync(path.join(tempDir, 'task-breakdown.md'), 'utf-8')
    const releaseChecklist = readFileSync(path.join(tempDir, 'release-checklist.md'), 'utf-8')

    assert.match(implementationPlan, /Recipe 特定要求|Recipe-Specific Notes/)
    assert.match(implementationPlan, /opencli/i)
    assert.match(interfaceMap, /管理后台|Admin website/)
    assert.match(interfaceMap, /opencli doctor/)
    assert.match(taskBreakdown, /BR-1/)
    assert.match(taskBreakdown, /tool-interface-map\.md/)
    assert.match(releaseChecklist, /opencli doctor/)
    assert.match(releaseChecklist, /浏览器证据|Browser evidence/)
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})
