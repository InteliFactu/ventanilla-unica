import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { applicationFormHtml } from '../fixtures/applicationFormHtml'
import { certificateSearchHtml } from '../fixtures/certificateSearchHtml'
import { roleceLoginPages } from '../fixtures/roleceLoginPages'
import { readRoleceStatus } from './readRoleceStatus'

const base = 'https://registrodelicitadores.gob.es/rolece'
const nif = 'B00000000'
const search = (name: string): ReturnType<typeof htmlResponse>[] => [
  htmlResponse(`${base}/public/visualizarCertificados.action?tipo=1`, '<p/>'),
  htmlResponse(
    `${base}/public/visualizarCertificados.action`,
    certificateSearchHtml(nif, name),
  ),
]
const check = (
  solicitudInicial: string,
  notice = '',
): ReturnType<typeof htmlResponse>[] => [
  htmlResponse(`${base}/comun/inscripcionPersonaF!comprobarPJ.action`, '<p/>'),
  htmlResponse(
    `${base}/comun/inscripcionPersonaF.action`,
    notice +
      applicationFormHtml({
        solicitudInicial,
        numDocumento: nif,
        inscrito: 'false',
      }),
  ),
]

describe('readRoleceStatus', () => {
  it('reports an operator the registry does not know, with the captcha note', async () => {
    const client = scriptedClient(
      ...roleceLoginPages(),
      ...search('NO INSCRITO EN EL REGISTRO'),
      ...check('true'),
    )
    const result = await readRoleceStatus(client, nif, '/tmp/out')
    expect(result).toMatchObject({
      registered: false,
      initialApplication: true,
    })
    expect(result.notes.join(' ')).toContain('Nothing to download')
    expect(client.request.mock.calls.at(-1)?.[1]?.form).toMatchObject({
      numDocumento: nif,
      'method:comprobarOEInscrito': 'Siguiente',
    })
  })

  it('reports an application already pending', async () => {
    const client = scriptedClient(
      ...roleceLoginPages(),
      ...search('NO INSCRITO EN EL REGISTRO'),
      ...check(
        '',
        '<p>Ya existe una solicitud para este operador pendiente</p>',
      ),
    )
    const result = await readRoleceStatus(client, nif)
    expect(result).toMatchObject({
      registered: false,
      initialApplication: false,
      pendingApplication: true,
    })
    expect(result.notes.join(' ')).toContain('Do not file again')
  })

  it('reports an inscribed operator without the application check', async () => {
    const client = scriptedClient(
      ...roleceLoginPages(),
      ...search('EJEMPLO SL'),
    )
    const result = await readRoleceStatus(client, nif, '/tmp/out')
    expect(result.registered).toBe(true)
    expect(result.notes.join(' ')).toContain('captcha')
    expect(client.request.mock.calls).toHaveLength(6)
  })

  it('refuses when the two screens disagree or the search is empty', async () => {
    await expect(
      readRoleceStatus(
        scriptedClient(
          ...roleceLoginPages(),
          ...search('NO INSCRITO EN EL REGISTRO'),
          ...check('false'),
        ),
        nif,
      ),
    ).rejects.toThrow('does not offer an initial application')
    const empty = htmlResponse(`${base}/public/x.action`, '<p/>')
    await expect(
      readRoleceStatus(
        scriptedClient(...roleceLoginPages(), empty, empty),
        nif,
      ),
    ).rejects.toThrow('has no row')
  })
})
