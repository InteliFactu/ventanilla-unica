import type { Mock } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { isFinalAccountPaymentStep } from './isFinalAccountPaymentStep'

/** How many times a portal was sent "Firmar y Enviar", which debits the account. */
export const countFinalAccountPaymentPosts = (
  portal: Mock<HttpClient['request']>,
): number =>
  portal.mock.calls.filter(([, options]) => isFinalAccountPaymentStep(options))
    .length
