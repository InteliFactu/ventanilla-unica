import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { applicationDocumentXml } from '../fixtures/applicationDocumentXml'
import { filingReceiptHtml } from '../fixtures/filingReceiptHtml'
import { roleceLoginPages } from '../fixtures/roleceLoginPages'
import { signingFixtures } from '../fixtures/signingFixtures'
import { signingScreenHtml } from '../fixtures/signingScreenHtml'
import { simplifiedApplicationPages } from '../fixtures/simplifiedApplicationPages'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import { planRoleceRegistration } from './planRoleceRegistration'

const { nif, sender, email, identity, document } = signingFixtures
const base = 'https://registrodelicitadores.gob.es/rolece/comun/'
const query: RegistrationQuery = {
  nif,
  comunidad: 'Extremadura',
  provincia: 'Cáceres',
  email,
  emailSolicitante: 'admin@example.com',
}
const walk = (xml = document) => [
  ...roleceLoginPages(),
  ...simplifiedApplicationPages(nif),
  htmlResponse(
    `${base}inscripcionPersonaF.action`,
    signingScreenHtml(xml, nif),
  ),
]
const posts = (client: ReturnType<typeof scriptedClient>) =>
  client.request.mock.calls.filter((call) =>
    call[0].includes('firmarSolicitud'),
  )

describe('planRoleceRegistration', () => {
  it('plans the draft, the signature and the post without filing', async () => {
    const escritura = await writeTestPdf('escritura.pdf')
    const client = scriptedClient(...walk())
    const result = await planRoleceRegistration(
      client,
      { ...query, escritura },
      false,
      identity,
    )
    expect(result.executed).toBe(false)
    const plan = result.plan.join('\n')
    expect(plan).toContain('provinciaSimpli = ES432')
    expect(plan).toContain(
      'correoElectronicoSimpliSolConfirmar = admin@example.com',
    )
    expect(plan).toContain(document)
    expect(plan).toContain('signer CN=00000000T TEST (R: B00000000)')
    expect(plan).toContain('token = onload-token')
    expect(plan).toContain('Not attached: escritura.pdf')
    expect(plan).not.toContain('ayudaCheck')
    expect(
      client.request.mock.calls.at(-1)?.[1]?.form?.['method:enviarSolicitud'],
    ).toBe('Firmar y Enviar Solicitud')
    expect(posts(client)).toHaveLength(0)
  })

  it('files once, in ISO-8859-1, and keeps the acuse de recibo', async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'ventanilla-unica-rolece-'))
    const pdf = {
      ...htmlResponse(`${base}x`, ''),
      body: Buffer.from('%PDF-1.4'),
    }
    const client = scriptedClient(
      ...walk(),
      htmlResponse(`${base}firmaSolicitud!firmarSolicitud`, filingReceiptHtml),
      pdf,
    )
    const result = await planRoleceRegistration(
      client,
      { ...query, outDir },
      true,
      identity,
    )
    expect(result.executed).toBe(true)
    expect(result.receipt).toMatchObject({
      filed: true,
      expediente: '2026/ROL/000123',
    })
    expect(result.receipt?.files).toHaveLength(3)
    const [filing] = posts(client)
    expect(posts(client)).toHaveLength(1)
    expect(filing?.[1]?.body).toContain('Secretar%EDa')
    expect(filing?.[1]?.body).toContain('&token=onload-token&')
    expect(client.request.mock.calls.at(-1)?.[1]?.form).toEqual({
      idSolicitud: '77',
      'method:descargarJustificante': 'Descargar el Justificante Electrónico',
    })
  })

  it('refuses a draft for another operator or a certificate of another company', async () => {
    const other = applicationDocumentXml({ nif: 'B11111111', sender, email })
    const client = scriptedClient(...walk(other))
    await expect(
      planRoleceRegistration(client, query, false, identity),
    ).rejects.toThrow('not the one planned')
    const stranger = scriptedClient(...walk())
    const alien = buildTestIdentity()
    await expect(
      planRoleceRegistration(stranger, query, false, alien),
    ).rejects.toThrow('nothing was signed')
    expect(posts(client)).toHaveLength(0)
  })

  it('refuses the ordinary application and a confirmed filing without --out', async () => {
    await expect(
      planRoleceRegistration(
        scriptedClient(
          ...roleceLoginPages(),
          ...simplifiedApplicationPages(nif, 'false'),
        ),
        query,
        false,
        identity,
      ),
    ).rejects.toThrow('only the simplified one is captured')
    const client = scriptedClient()
    await expect(
      planRoleceRegistration(client, query, true, identity),
    ).rejects.toThrow('--out is required')
    await expect(
      planRoleceRegistration(client, query, false, undefined),
    ).rejects.toThrow('needs the certificate')
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
