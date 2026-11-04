import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'
import { youthGuaranteePage } from './youthGuaranteePage'

export const youthGuaranteeReadResponses = (
  landing = youthGuaranteePage(1),
): HttpResponse[] => [
  htmlResponse(
    youthGuaranteeUrls.login,
    '<form action="https://pasarela.clave.gob.es/Proxy2/ServiceProvider"><input name="SAMLRequest" value="synthetic-request"></form>',
  ),
  htmlResponse(
    'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
    '<form name="idpRedirect" action="https://pasarela.clave.gob.es/Proxy2/ServiceRedirect"><input name="SAMLRequest" value="synthetic-request"><input name="SelectedIdP" value=""></form>',
  ),
  htmlResponse(
    'https://pasarela.clave.gob.es/Proxy2/ServiceRedirect',
    '<form action="https://garantiajuvenil.sepe.es/j_spring_security_check"><input name="SAMLResponse" value="synthetic-response"></form>',
  ),
  htmlResponse(youthGuaranteeUrls.page(1), landing),
  htmlResponse(youthGuaranteeUrls.history, '{"recordsTotal":0,"data":[]}'),
  ...Array.from({ length: 6 }, (_, index) =>
    htmlResponse(
      youthGuaranteeUrls.page(index + 1),
      youthGuaranteePage(index + 1),
    ),
  ),
]
