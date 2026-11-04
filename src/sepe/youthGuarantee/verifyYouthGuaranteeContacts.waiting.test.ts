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

describe('contact verification waits in the existing session', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  it('requests each message once, submits the PIN and follows the email link in the same session', async () => {
    vi.useFakeTimers()
    vi.mocked(readFile)
      .mockRejectedValueOnce(
        Object.assign(new Error('pending'), { code: 'ENOENT' }),
      )
      .mockResolvedValueOnce('012345\n')
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce(`${youthGuaranteeEmailLink}\n`)
    const stderr = vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const client = scriptedClient(
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('0', '0', 'sms-token'),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '0', 'otp-token'),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '2', 'email-token'),
      ),
      htmlResponse(youthGuaranteeEmailLink, 'Email confirmed'),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '1', 'next-token'),
      ),
    )
    const pending = verifyYouthGuaranteeContacts(
      client,
      htmlResponse(youthGuaranteeUrls.page(2), youthGuaranteeContactPage()),
      youthGuaranteeContactAnswers,
      youthGuaranteeVerificationFiles,
    )
    await vi.advanceTimersByTimeAsync(0)
    expect(client.request.mock.calls).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(5000)
    expect(client.request.mock.calls).toHaveLength(3)
    await vi.advanceTimersByTimeAsync(5000)
    const result = await pending
    expect(result.text).toContain('next-token')
    expect(client.request.mock.calls[0]?.[1]?.form).toMatchObject({
      confirmarMovil: 'Verificar móvil',
      token: 'contact-0',
    })
    expect(client.request.mock.calls[1]?.[1]?.form).toMatchObject({
      confirmarOTP: 'Confirmar código',
      pinSMS: '012345',
      token: 'sms-token',
    })
    expect(client.request.mock.calls[2]?.[1]?.form).toMatchObject({
      confirmarCorreo: 'Verificar correo',
      token: 'otp-token',
    })
    expect(
      client.request.mock.calls
        .slice(0, 3)
        .every(([, options]) => options?.form?.['siguiente'] === undefined),
    ).toBe(true)
    expect(stderr.mock.calls.flat().join('')).toContain('SMS requested')
    expect(stderr.mock.calls.flat().join('')).not.toContain('012345')
    expect(stderr.mock.calls.flat().join('')).not.toContain('token=')
  })
})
