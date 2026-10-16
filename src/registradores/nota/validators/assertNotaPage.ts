import { htmlToText } from '../../../html/htmlToText'
import type { HttpResponse } from '../../../http/types/HttpResponse'

/**
 * Refuse to go on when a step did not land where the flow expects: the
 * marker is a form action or field only the next page carries. The sede
 * answers its validation errors on the same page, so the first visible error
 * message is quoted.
 */
export const assertNotaPage = (
  response: HttpResponse,
  marker: string,
  step: string,
): void => {
  if (response.text.includes(marker)) return
  const error = [
    ...response.text.matchAll(
      /class="form-msg form-msg--error([^"]*)"[^>]*>([\s\S]*?)<\/div>/g,
    ),
  ].find((match) => !(match[1] ?? '').includes('hide'))?.[2]
  throw new Error(
    `registradores: ${step} did not reach the next page (HTTP ${String(response.status)} at ${response.url.split('?')[0] ?? ''})${error ? `: ${htmlToText(error)}` : ''}`,
  )
}
