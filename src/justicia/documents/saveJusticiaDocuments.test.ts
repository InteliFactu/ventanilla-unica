import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { justiciaUrls } from '../session/justiciaUrls'
import { saveJusticiaDocuments } from './saveJusticiaDocuments'

const session = {
  url: 'https://eje.justicia.es/visor-webapp/visor',
  csrf: 'csrf',
  execution: 'e1s1',
  codExpediente: '1',
  procedimiento: 'ETJ 153/2026',
}

const document = {
  titulo: 'Escrito',
  tipo: 'doc',
  fecha: '2026-10-22',
  carpeta: 'ESCRITOS',
  codigoBarras: 'B1',
  accesible: true,
}

const refused = { ...document, id: 'p-31', numero: '31', codigoBarras: '' }
const saved = { ...document, id: 'd-32', numero: '32' }
const inaccessible = { ...document, id: 'd-33', numero: '33', accesible: false }

describe('saveJusticiaDocuments', () => {
  it('keeps a refused document as an error and saves the ones after it', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'justicia-out-'))
    const client = scriptedClient(
      htmlResponse(justiciaUrls.visorAjax, '{"result":false}'),
      htmlResponse(
        justiciaUrls.visorAjax,
        '{"result":true,"extension":".PDF"}',
      ),
      htmlResponse(justiciaUrls.visorDocument, '%PDF-1.4 escrito'),
    )
    const result = await saveJusticiaDocuments(
      client,
      session,
      [refused, saved, inaccessible],
      dir,
    )
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      ...refused,
      error: 'Justicia: the visor refused document 31',
    })
    expect(result[1]?.error).toBeUndefined()
    expect(result[1]?.bytes).toBe(16)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(readFileSync(result[1]?.path ?? '').toString()).toBe(
      '%PDF-1.4 escrito',
    )
    expect(result[2]).toEqual(inaccessible)
    expect(client.request.mock.calls).toHaveLength(3)
  })

  it('keeps a failed download as an error and goes on', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'justicia-out-'))
    const client = scriptedClient(
      htmlResponse(justiciaUrls.visorAjax, '{"result":true}'),
      { ...htmlResponse(justiciaUrls.visorDocument, ''), status: 500 },
      htmlResponse(justiciaUrls.visorAjax, '{"result":true}'),
      htmlResponse(justiciaUrls.visorDocument, '%PDF-1.4'),
    )
    const result = await saveJusticiaDocuments(
      client,
      session,
      [saved, { ...saved, id: 'd-34', numero: '34' }],
      dir,
    )
    expect(result[0]?.error).toBe('Justicia: document 32 answered 500')
    expect(result[0]?.path).toBeUndefined()
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(readFileSync(result[1]?.path ?? '').toString()).toBe('%PDF-1.4')
  })

  it('still stops when the output folder cannot be written', async () => {
    const file = join(mkdtempSync(join(tmpdir(), 'justicia-out-')), 'taken')
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(file, '')
    const client = scriptedClient(
      htmlResponse(justiciaUrls.visorAjax, '{"result":true}'),
      htmlResponse(justiciaUrls.visorDocument, '%PDF-1.4'),
    )
    await expect(
      saveJusticiaDocuments(client, session, [saved], file),
    ).rejects.toThrow()
  })
})
