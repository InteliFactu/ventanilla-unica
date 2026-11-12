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

describe('step-2 contact verification (synthetic HTTP and files)', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  it('stops after a rejected OTP without requesting email or advancing the form', async () => {
    vi.mocked(readFile).mockResolvedValueOnce('').mockResolvedValue('123456')
    vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const page = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage(),
    )
    const client = scriptedClient(page, page)
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        page,
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/confirmaMovil is not 1/)
    expect(client.request.mock.calls).toHaveLength(2)
  })
  it('does not trust an awaiting-email flag after following the link', async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce('')
      .mockResolvedValue(youthGuaranteeEmailLink)
    vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const page = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage('1', '2'),
    )
    const client = scriptedClient(
      page,
      htmlResponse('https://garantiajuvenil.sepe.es/verify', 'ok'),
      page,
    )
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        page,
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/confirmaCorreo is not 1/)
    expect(client.request.mock.calls[0]?.[1]?.form).toHaveProperty(
      'confirmarCorreo',
    )
  })
  it('does not send new messages for unchanged contacts already verified', async () => {
    const page = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage('1', '1'),
    )
    const client = scriptedClient()
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        page,
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).resolves.toEqual(page)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('requests verification again when the declared mobile differs from the verified one', async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce('')
      .mockResolvedValue('not a code!')
    vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const page = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage('1', '1'),
    )
    const client = scriptedClient(page)
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        page,
        {
          ...youthGuaranteeContactAnswers,
          '2': {
            ...youthGuaranteeContactAnswers['2'],
            'datosContacto.movilC': '600000001',
          },
        },
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/only letters and digits/)
    expect(client.request.mock.calls[0]?.[1]?.form).toHaveProperty(
      'confirmarMovil',
    )
  })
  it('rejects a link that only proves the previously verified email address', async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce('')
      .mockResolvedValue(youthGuaranteeEmailLink)
    vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const page = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage('1', '1'),
    )
    const client = scriptedClient(
      page,
      htmlResponse('https://garantiajuvenil.sepe.es/verify', 'ok'),
      page,
    )
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        page,
        {
          ...youthGuaranteeContactAnswers,
          '2': {
            ...youthGuaranteeContactAnswers['2'],
            'datosContacto.correoElectronicoC': 'changed@example.test',
          },
        },
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/declared email/)
  })
  it('does not resend an SMS after its response is lost', async () => {
    vi.mocked(readFile).mockResolvedValue('')
    const client = scriptedClient()
    client.request.mockRejectedValueOnce(new Error('lost response'))
    await expect(
      verifyYouthGuaranteeContacts(
        client,
        htmlResponse(youthGuaranteeUrls.page(2), youthGuaranteeContactPage()),
        youthGuaranteeContactAnswers,
        youthGuaranteeVerificationFiles,
      ),
    ).rejects.toThrow(/mobile SMS request was sent.*Do not retry/)
    expect(client.request.mock.calls).toHaveLength(1)
    // Only the emptiness check before the request; nothing waits for a code.
    expect(readFile).toHaveBeenCalledTimes(1)
  })
})
