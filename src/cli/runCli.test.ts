import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { parseCliOptions } from './parseCliOptions'
import { runCli } from './runCli'
import type { Command } from './types/Command'

const echo: Command = {
  portal: 'demo',
  action: 'echo',
  description: 'answers its options',
  options: ['nif'],
  run: async (_client, options) => {
    const nif = await Promise.resolve(options['nif'])
    return { nif }
  },
}

describe('runCli', () => {
  it('prints usage and a usage exit code for an unknown command', async () => {
    const out: string[] = []
    const code = await runCli(['nope', 'x'], [echo], (text) => out.push(text))
    expect(code).toBe(2)
    expect(out.join('')).toContain('demo echo')
    expect(out.join('')).toContain('--nif')
  })

  it('prints usage with a zero exit code on --help', async () => {
    const out: string[] = []
    const code = await runCli(['demo', 'echo', '--help'], [echo], (text) =>
      out.push(text),
    )
    expect(code).toBe(0)
    expect(out.join('')).toContain('usage:')
  })

  it('runs the command with a certificate client and prints JSON', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-'))
    const cert = join(dir, 'c.pem')
    const key = join(dir, 'k.pem')
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(cert, 'cert')
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(key, 'key')
    const out: string[] = []
    const code = await runCli(
      ['demo', 'echo', '--cert', cert, '--key', key, '--nif', 'X'],
      [echo],
      (text) => out.push(text),
    )
    expect(code).toBe(0)
    expect(JSON.parse(out.join(''))).toEqual({ nif: 'X' })
  })

  it('refuses to run without a certificate', async () => {
    const previous = { ...process.env }
    delete process.env['VENTANILLA_UNICA_CERT']
    delete process.env['VENTANILLA_UNICA_KEY']
    try {
      await expect(runCli(['demo', 'echo'], [echo], () => {})).rejects.toThrow(
        'certificate required',
      )
    } finally {
      process.env = previous
    }
  })
})

describe('parseCliOptions', () => {
  it('rejects an option the command does not declare', () => {
    expect(() => parseCliOptions(['--bogus', '1'], [])).toThrow()
    expect(parseCliOptions(['--out', 'dir'], [])).toEqual({
      cert: undefined,
      key: undefined,
      out: 'dir',
    })
  })
})

it('runs password commands without loading a certificate or using the offline client', async () => {
  const command: Command = {
    ...echo,
    login: 'password',
    run: async (client, _options, identity) => {
      expect(identity).toBeUndefined()
      expect(client.cookie('rayuela.educarex.es', 'session')).toBeUndefined()
      return Promise.resolve({ password: true })
    },
  }
  const output: string[] = []
  expect(
    await runCli(
      ['demo', 'echo', '--cert', '/nonexistent/cert'],
      [command],
      (text) => output.push(text),
    ),
  ).toBe(0)
  expect(JSON.parse(output.join(''))).toEqual({ password: true })
})
