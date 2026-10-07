import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { RecordedHttpCall } from '../../../http/types/RecordedHttpCall'
import type { RecordingHttpClientExtras } from '../../../http/types/RecordingHttpClientExtras'
import { filingFormPage } from './filingFormPage'
import { signatureScreenPage } from './signatureScreenPage'
import { uploadAnswer } from './uploadAnswer'

/**
 * A registry that answers each step with its synthetic page: uploads get
 * keys K0, K1..., `FGGraba` lists the keys so far, `FG` with `pAccionForm2`
 * the signature screen for `listed`, and the signature the receipt page.
 */
export const fakeFilingClient = (
  listed: readonly string[],
  receipt = '<p>Recibo CSV=ZZZZYYYYXXXXWWWW</p>',
): HttpClient & RecordingHttpClientExtras => {
  const calls: RecordedHttpCall[] = []
  const keys: string[] = []
  const respond = async (
    url: string,
    text: string,
  ): ReturnType<HttpClient['request']> =>
    Promise.resolve({
      status: 200,
      url,
      headers: {},
      body: Buffer.from(text),
      text,
    })
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options: HttpRequestOptions = {}) => {
      calls.push({ url, options })
      const body = typeof options.body === 'string' ? options.body : ''
      if (url.includes('UploadSv')) {
        keys.push(`K${String(keys.length)}`)
        return respond(url, uploadAnswer(keys.at(-1) ?? '', 'x.pdf'))
      }
      if (url.includes('FGGraba'))
        return respond(url, filingFormPage(keys.join('@')))
      if (url.includes('KATA-APLI'))
        return respond(url, '%PDF-1.4 justificante')
      if (url.endsWith('/FG') && body.includes('FIR=FirmaBasica'))
        return respond(url, receipt)
      if (url.endsWith('/FG')) return respond(url, signatureScreenPage(listed))
      return respond(url, filingFormPage())
    },
  )
  return { request, cookie: () => undefined, calls }
}
