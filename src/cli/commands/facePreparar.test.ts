/* eslint-disable security/detect-non-literal-fs-filename -- paths are built under this test's directory */
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { syntheticFacturae322 } from '../../face/fixtures/syntheticFacturae322'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { commandRegistry } from '../commandRegistry'
import { offlineHttpClient } from '../offlineHttpClient'
import { runCli } from '../runCli'
import { facePreparar } from './facePreparar'

describe('face preparar', () => {
  it('signs through the registered CLI command with synthetic PEM files', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'face-cli-'))
    const input = join(dir, 'invoice.xml')
    const out = join(dir, 'invoice.xsig')
    const cert = join(dir, 'synthetic-cert.pem')
    const key = join(dir, 'synthetic-key.pem')
    const identity = buildTestIdentity()
    await Promise.all([
      writeFile(input, syntheticFacturae322),
      writeFile(cert, identity.cert),
      writeFile(key, identity.key, { mode: 0o600 }),
    ])
    const output: string[] = []
    const exitCode = await runCli(
      [
        'face',
        'preparar',
        '--in',
        input,
        '--out',
        out,
        '--cert',
        cert,
        '--key',
        key,
      ],
      commandRegistry,
      (text) => output.push(text),
    )
    expect(exitCode).toBe(0)
    expect(output.join('')).toContain(JSON.stringify(out))
    expect(await readFile(out, 'utf8')).toContain(
      'politica_de_firma_formato_facturae',
    )
  })

  it('writes a signed local invoice without overwriting an existing file', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'face-preparar-'))
    const input = join(dir, 'invoice.xml')
    const out = join(dir, 'invoice.xsig')
    const identity = buildTestIdentity()
    await writeFile(input, syntheticFacturae322)
    await expect(
      facePreparar.run(offlineHttpClient, { in: input, out }, identity),
    ).resolves.toMatchObject({ out })
    const signed = await readFile(out, 'utf8')
    expect(signed).toContain('politica_de_firma_formato_facturae')
    await expect(
      facePreparar.run(offlineHttpClient, { in: input, out }, identity),
    ).rejects.toThrow(/EEXIST/u)
    await expect(readFile(out, 'utf8')).resolves.toBe(signed)
  })

  it('does not accept a filing confirmation', async () => {
    await expect(
      runCli(
        ['face', 'preparar', '--confirmar', 'si'],
        commandRegistry,
        () => undefined,
      ),
    ).rejects.toThrow(/confirmar/u)
  })
})
