/* eslint-disable security/detect-non-literal-fs-filename -- variable paths belong to this synthetic temporary fixture; the source config path is fixed */
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('Tadu pre-commit check', () => {
  it.each([0, 7, null])(
    'handles Tadu exit %s without other hooks',
    (status) => {
      const root = mkdtempSync(join(tmpdir(), 'ventanilla hook '))
      const repository = join(root, 'repository with spaces')
      const binaries = join(root, 'fake binaries')
      const record = join(root, 'tadu-record')
      const unexpected = join(root, 'unexpected-job')
      const externalIndex = join(root, 'external-index')
      const redirectedGit = join(root, 'must-not-exist.git')
      try {
        mkdirSync(repository)
        mkdirSync(binaries)
        writeFileSync(externalIndex, 'external sentinel\n')
        const inherited = {
          ...process.env,
          GIT_DIR: redirectedGit,
          GIT_WORK_TREE: join(root, 'external work tree'),
          GIT_INDEX_FILE: externalIndex,
          LEFTHOOK_CONFIG: join(root, 'must-not-load.yml'),
        }
        const env = {
          ...Object.fromEntries(
            Object.entries(inherited).filter(
              ([name]) =>
                !name.toUpperCase().startsWith('GIT_') &&
                !name.toUpperCase().startsWith('LEFTHOOK'),
            ),
          ),
          GIT_CONFIG_GLOBAL: '/dev/null',
          GIT_CONFIG_NOSYSTEM: '1',
          PATH: `${binaries}:/usr/bin:/bin`,
          HOOK_RECORD: record,
          HOOK_UNEXPECTED: unexpected,
          HOOK_STATUS: String(status),
        }
        const initialized = spawnSync(
          'git',
          ['init', '--quiet', '--initial-branch=main', repository],
          { env },
        )
        expect(initialized.status).toBe(0)
        const config = readFileSync(resolve('lefthook.yml'), 'utf8')
        writeFileSync(join(repository, 'lefthook.yml'), config)
        writeFileSync(
          join(repository, 'keep.ts'),
          'export const synthetic = true\n',
        )
        const staged = spawnSync(
          'git',
          ['-C', repository, 'add', '--', 'keep.ts'],
          { env },
        )
        expect(staged.status).toBe(0)
        if (status !== null)
          writeFileSync(
            join(binaries, 'tadu'),
            '#!/bin/sh\nprintf "%s\\n" "$PWD" "$@" > "$HOOK_RECORD"\nexit "$HOOK_STATUS"\n',
            { mode: 0o755 },
          )
        writeFileSync(
          join(binaries, 'pnpm'),
          '#!/bin/sh\nprintf "unexpected" > "$HOOK_UNEXPECTED"\nexit 99\n',
          { mode: 0o755 },
        )
        const result = spawnSync(
          process.execPath,
          [
            resolve('node_modules/lefthook/bin/index.js'),
            'run',
            'pre-commit',
            '--command',
            'tadu-doctor',
            '--force',
            '--no-auto-install',
            '--no-tty',
          ],
          {
            cwd: repository,
            encoding: 'utf8',
            timeout: 15_000,
            env,
          },
        )
        const output = result.stdout + result.stderr
        expect(result.error).toBeUndefined()
        expect(result.status).toBe(status === 0 ? 0 : 1)
        const recorded = existsSync(record)
          ? readFileSync(record, 'utf8').split('\n')
          : null
        expect(recorded).toEqual(
          status === null
            ? null
            : [realpathSync(repository), 'doctor', '.', ''],
        )
        expect(
          output.includes('https://github.com/syntopica/tadu#install'),
        ).toBe(status === null)
        expect(existsSync(unexpected)).toBe(false)
        expect(readFileSync(externalIndex, 'utf8')).toBe('external sentinel\n')
        expect(existsSync(redirectedGit)).toBe(false)
        expect(readFileSync(join(repository, 'lefthook.yml'), 'utf8')).toBe(
          config,
        )
        expect(readFileSync(join(repository, 'keep.ts'), 'utf8')).toBe(
          'export const synthetic = true\n',
        )
        expect(existsSync(join(repository, '.git/hooks/pre-commit'))).toBe(
          false,
        )
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    },
  )
})
