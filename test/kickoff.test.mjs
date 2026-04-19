import { chmodSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { createWorkspace, createWorkspaceFromIssue } from '../packages/core/src/kickoff.mjs'
import { runDoctor } from '../packages/core/src/doctor.mjs'

function makeTempDir(prefix) {
  return mkdtempSync(path.join(os.tmpdir(), prefix))
}

function writeExecutable(dir, name, content = '#!/usr/bin/env sh\nexit 0\n') {
  const filePath = path.join(dir, name)
  writeFileSync(filePath, content)
  chmodSync(filePath, 0o755)
  return filePath
}

test('createWorkspace auto-adds tool-interface-map for interface-heavy requests', () => {
  const result = createWorkspace({
    title: 'OpenCLI browser automation',
    summary: 'Automate an admin website with browser actions',
    'dry-run': true,
  })

  assert.deepEqual(result.optionalArtifacts, ['tool-interface-map'])
  assert.equal(result.optionalArtifactReasons['tool-interface-map'], 'matched interface keyword: opencli')
  assert.ok(result.files.some(file => file.endsWith('/tool-interface-map.md')))
})

test('createWorkspace respects --without-interface-map over automatic detection', () => {
  const result = createWorkspace({
    title: 'OpenCLI browser automation',
    summary: 'Automate an admin website with browser actions',
    'without-interface-map': true,
    'dry-run': true,
  })

  assert.deepEqual(result.optionalArtifacts, [])
  assert.ok(result.files.every(file => !file.endsWith('/tool-interface-map.md')))
})

test('createWorkspaceFromIssue uses issue body for interface map detection', () => {
  const tempDir = makeTempDir('delivery-os-issue-test-')
  const issuePath = path.join(tempDir, 'issue.json')

  writeFileSync(issuePath, `${JSON.stringify({
    number: 42,
    title: 'Automate admin review flow',
    body: 'Need browser automation for the internal admin website and dashboard.',
    labels: [{ name: 'legacy-maintenance' }],
    url: 'https://example.com/issues/42',
  }, null, 2)}\n`)

  try {
    const result = createWorkspaceFromIssue({
      file: issuePath,
      'dry-run': true,
    })

    assert.deepEqual(result.optionalArtifacts, ['tool-interface-map'])
    assert.equal(result.optionalArtifactReasons['tool-interface-map'], 'matched interface keyword: website')
    assert.ok(result.files.some(file => file.endsWith('/tool-interface-map.md')))
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('runDoctor validates a workspace and its optional artifacts', () => {
  const tempDir = makeTempDir('delivery-os-workspace-test-')

  try {
    createWorkspace({
      title: 'OpenCLI browser automation',
      summary: 'Automate an admin website with browser actions',
      out: tempDir,
      force: true,
    })

    const report = runDoctor({
      workspace: tempDir,
      'skip-remote': true,
    })

    const failed = report.results.filter(item => !item.ok)
    assert.deepEqual(failed, [])
    assert.ok(report.results.some(item => item.label === 'workspace:file:kickoff.json'))
    assert.ok(report.results.some(item => item.label === 'workspace:optional-artifact:tool-interface-map'))
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('runDoctor can check the local toolchain when requested', () => {
  const tempDir = makeTempDir('delivery-os-toolchain-test-')
  const binDir = path.join(tempDir, 'bin')

  try {
    mkdirSync(binDir, { recursive: true })
    writeExecutable(binDir, 'gh', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'vercel', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'opencli', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'pnpm', '#!/usr/bin/env sh\nexit 0\n')

    createWorkspace({
      title: 'OpenCLI browser automation',
      summary: 'Automate an admin website with browser actions',
      out: tempDir,
      force: true,
    })

    const report = runDoctor({
      workspace: tempDir,
      'skip-remote': true,
      'check-toolchain': true,
      env: {
        ...process.env,
        PATH: `${binDir}:${process.env.PATH}`,
      },
    })

    const failed = report.results.filter(item => !item.ok)
    assert.deepEqual(failed, [])
    assert.equal(
      report.results.find(item => item.label === 'toolchain:scope')?.detail,
      'auto:gh,opencli',
    )
    assert.ok(report.results.some(item => item.label === 'toolchain:gh-auth'))
    assert.ok(!report.results.some(item => item.label === 'toolchain:vercel-whoami'))
    assert.ok(report.results.some(item => item.label === 'toolchain:opencli-doctor'))
    assert.ok(!report.results.some(item => item.label === 'toolchain:playwright'))
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('runDoctor can force all toolchain checks', () => {
  const tempDir = makeTempDir('delivery-os-toolchain-all-test-')
  const binDir = path.join(tempDir, 'bin')

  try {
    mkdirSync(binDir, { recursive: true })
    writeExecutable(binDir, 'gh', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'vercel', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'opencli', '#!/usr/bin/env sh\nexit 0\n')
    writeExecutable(binDir, 'pnpm', '#!/usr/bin/env sh\nexit 0\n')

    const report = runDoctor({
      'skip-remote': true,
      'check-toolchain': 'all',
      env: {
        ...process.env,
        PATH: `${binDir}:${process.env.PATH}`,
      },
    })

    const failed = report.results.filter(item => !item.ok)
    assert.deepEqual(failed, [])
    assert.equal(
      report.results.find(item => item.label === 'toolchain:scope')?.detail,
      'all:gh,vercel,opencli,playwright',
    )
    assert.ok(report.results.some(item => item.label === 'toolchain:gh-auth'))
    assert.ok(report.results.some(item => item.label === 'toolchain:vercel-whoami'))
    assert.ok(report.results.some(item => item.label === 'toolchain:opencli-doctor'))
    assert.ok(report.results.some(item => item.label === 'toolchain:playwright'))
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('runDoctor rejects unsupported explicit toolchain targets', () => {
  assert.throws(() => {
    runDoctor({
      'skip-remote': true,
      toolchain: 'gh,unknown-cli',
    })
  }, /Unsupported toolchain target/)
})
