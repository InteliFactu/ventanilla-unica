import { readFile } from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { youthGuaranteeContactAnswers } from './fixtures/youthGuaranteeContactAnswers'
import { youthGuaranteeContactPage } from './fixtures/youthGuaranteeContactPage'
import { youthGuaranteeEmailLink } from './fixtures/youthGuaranteeEmailLink'
import { youthGuaranteeVerificationFiles } from './fixtures/youthGuaranteeVerificationFiles'
import { verifyYouthGuaranteeContacts } from './verifyYouthGuaranteeContacts'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }))

const contactPage = (mobile: string, email: string, token?: string) =>
  htmlResponse(
    youthGuaranteeUrls.page(2),
    youthGuaranteeContactPage(mobile, email, token),
  )

describe('step-2 contact verification needs explicit intent', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  it.each([
    ['an unverified mobile', '0', '1', /--sms solicitar/],
    ['a pending SMS challenge', '2', '1', /--sms solicitar/],
    ['a pending email link', '1', '2', /--correo solicitar/],
  ])(
    'stops on %s without intent before any request or file read',
    async (_, mobile, email, message) => {
      const client = scriptedClient()
      await expect(
        verifyYouthGuaranteeContacts(
          client,
          contactPage(mobile, email),
          youthGuaranteeContactAnswers,
          { pinFile: '/synthetic/pin', linkFile: '/synthetic/link' },
        ),
      ).rejects.toThrow(message)
      expect(client.request.mock.calls).toHaveLength(0)
      expect(readFile).not.toHaveBeenCalled()
    },
  )
  it('checks the email intent before sending an SMS', async () => {
    const client = scriptedClient()
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        contactPage('0', '0'),
        youthGuaranteeContactAnswers,
        { ...youthGuaranteeVerificationFiles, emailIntent: undefined },
      ),
    ).rejects.toThrow(/--correo solicitar/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('refuses to request an SMS while the PIN file already holds a code', async () => {
    vi.mocked(readFile).mockResolvedValue('OLD123')
    const client = scriptedClient()
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        contactPage('0', '1'),
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/absent or empty before a new request/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('refuses to request an email while the link file already holds a link', async () => {
    vi.mocked(readFile).mockResolvedValue(youthGuaranteeEmailLink)
    const client = scriptedClient()
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        contactPage('1', '0'),
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/link file must be absent or empty/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('reuses a still-valid code without requesting a new SMS', async () => {
    vi.mocked(readFile).mockResolvedValue('AB12CD34\n')
    const client = scriptedClient(contactPage('1', '1', 'after-otp'))
    const result = await verifyYouthGuaranteeContacts(
      client,
      contactPage('2', '1', 'pending'),
      youthGuaranteeContactAnswers,
      { ...youthGuaranteeVerificationFiles, mobileIntent: 'reutilizar' },
    )
    expect(result.text).toContain('after-otp')
    expect(client.request.mock.calls).toHaveLength(1)
    expect(client.request.mock.calls[0]?.[1]?.form).toMatchObject({
      confirmarOTP: 'Confirmar código',
      pinSMS: 'AB12CD34',
      token: 'pending',
    })
    expect(client.request.mock.calls[0]?.[1]?.form).not.toHaveProperty(
      'confirmarMovil',
    )
  })
  it('refuses to reuse an empty PIN file', async () => {
    vi.mocked(readFile).mockResolvedValue('')
    const client = scriptedClient()
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        contactPage('2', '1'),
        youthGuaranteeContactAnswers,
        { ...youthGuaranteeVerificationFiles, mobileIntent: 'reutilizar' },
      ),
    ).rejects.toThrow(/reutilizar needs the still-valid pin/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('follows a still-valid link without requesting a new email', async () => {
    vi.mocked(readFile).mockResolvedValue(youthGuaranteeEmailLink)
    const client = scriptedClient(
      htmlResponse(youthGuaranteeEmailLink, 'Email confirmed'),
      contactPage('1', '1', 'after-link'),
    )
    const result = await verifyYouthGuaranteeContacts(
      client,
      contactPage('1', '2'),
      youthGuaranteeContactAnswers,
      { ...youthGuaranteeVerificationFiles, emailIntent: 'reutilizar' },
    )
    expect(result.text).toContain('after-link')
    expect(
      client.request.mock.calls.some(
        ([, options]) => options?.form?.['confirmarCorreo'] !== undefined,
      ),
    ).toBe(false)
  })
})
