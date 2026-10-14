import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'

/** An open IRIA session: the client holding its cookies and the page the login landed on. */
export type IriaSession = {
  readonly client: HttpClient
  readonly page: HttpResponse
}
