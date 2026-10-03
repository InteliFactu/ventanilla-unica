import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { roleceLoginPages } from '../fixtures/roleceLoginPages'
import { simplifiedApplicationPages } from '../fixtures/simplifiedApplicationPages'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import { planRoleceRegistration } from './planRoleceRegistration'

const nif = 'B00000000'
const query: RegistrationQuery = {
  nif,
  comunidad: 'Extremadura',
  provincia: 'Cáceres',
  email: 'info@example.com',
  emailSolicitante: 'admin@example.com',
}

describe('planRoleceRegistration', () => {
  it('plans the exact body of Firmar y Enviar Solicitud without posting it', async () => {
    const escritura = await writeTestPdf('escritura.pdf')
    const client = scriptedClient(
      ...roleceLoginPages(),
      ...simplifiedApplicationPages(nif),
    )
    const result = await planRoleceRegistration(
      client,
      { ...query, escritura },
      false,
    )
    expect(result.executed).toBe(false)
    const plan = result.plan.join('\n')
    expect(plan).toContain('provinciaSimpli = ES432')
    expect(plan).toContain(
      'correoElectronicoSimpliSolConfirmar = admin@example.com',
    )
    expect(plan).toContain('Not attached: escritura.pdf')
    expect(plan).not.toContain('ayudaCheck')
    const posted = client.request.mock.calls.map((call) => call[1]?.form ?? {})
    expect(posted.some((form) => 'method:enviarSolicitud' in form)).toBe(false)
    expect(client.request.mock.calls.at(-1)?.[1]?.form?.['tipoComunidad']).toBe(
      'ES43',
    )
  })

  it('refuses the ordinary application and an unknown province', async () => {
    await expect(
      planRoleceRegistration(
        scriptedClient(
          ...roleceLoginPages(),
          ...simplifiedApplicationPages(nif, 'false'),
        ),
        query,
        false,
      ),
    ).rejects.toThrow('only the simplified one is captured')
    await expect(
      planRoleceRegistration(
        scriptedClient(
          ...roleceLoginPages(),
          ...simplifiedApplicationPages(nif),
        ),
        { ...query, provincia: 'Lugo' },
        false,
      ),
    ).rejects.toThrow('choices: CACERES')
  })

  it('refuses a confirmed filing without touching the network', async () => {
    const client = scriptedClient()
    await expect(planRoleceRegistration(client, query, true)).rejects.toThrow(
      'cannot file yet',
    )
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
