import type { Mock } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'

/** The parts of an HTTP client a Carpeta test double provides. */
export type FakeCarpetaClient = {
  readonly request: Mock<HttpClient['request']>
  readonly cookie: HttpClient['cookie']
}
