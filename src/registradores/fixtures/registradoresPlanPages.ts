import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { registradoresLoginPages } from './registradoresLoginPages'

/** Synthetic pages of a nota plan run, in request order: the logins, the walk to identification and the two JSON helpers. */
export const registradoresPlanPages = (): HttpResponse[] => {
  const site = 'https://sede.registradores.org/site/'
  const csrf = '<input type="hidden" name="_csrf" value="csrf-1"/>'
  return [
    ...registradoresLoginPages(),
    htmlResponse(
      `${site}certificado/mercantil/busqueda`,
      `<form method="post" action="/site/certificado/mercantil/busqueda/tipos-informacion">${csrf}<table><tbody class="table-body">
<tr><td><input type="radio" class="hide" name="selectedDocumentId" value="doc-other"/><span data-qa="resultSociedad1">OTRA EMPRESA SA</span></td><td data-qa="resultNif1"><span>A00000000</span></td><td><span>1000000000001</span></td><td>MADRID</td><td><span>Vigente</span></td></tr>
<tr><td><input type="radio" class="hide" name="selectedDocumentId" id="sociedadId" checked="checked" value="doc-1"/><span data-qa="resultSociedad2">EJEMPLO ACTIVIDADES SL</span></td><td data-qa="resultNif2"><span>B00000000</span></td><td><span>1000000000002</span></td><td>CACERES</td><td><span class="status-current">Vigente</span></td></tr>
</tbody></table></form>`,
    ),
    htmlResponse(
      `${site}certificado/mercantil/tipos-informacion`,
      `<form action="/site/certificado/mercantil/tipos-informacion" method="post">${csrf}<div class="form-msg form-msg--info"><p>La sociedad que usted ha seleccionado no tiene dep&oacute;sito de cuentas disponibles.</p></div><input type="radio" name="tipoInformacion" value="MERC_INFORMACION_GENERAL_MERCANTIL" checked="checked"/></form>`,
    ),
    htmlResponse(
      `${site}certificado/mercantil/segmentos`,
      `<form action="/site/certificado/mercantil/segmentos" method="post">${csrf}<input type="checkbox" value="true" name="capital"/><input type="checkbox" value="true" name="administradores"/></form>`,
    ),
    htmlResponse(
      `${site}certificado/identificacion`,
      `<form class="form" action="/site/invitado/confirmar-identificacion-invitado" method="post">${csrf}<input type="hidden" name="personCertificationData.documentType" value="NIF"/><input type="hidden" name="personCertificationData.documentNumber" value="00000000T"/><input type="hidden" name="personCertificationData.name" value="ANA"/><input type="hidden" name="personCertificationData.primaryLastName" value="EJEMPLO"/><input type="hidden" name="personCertificationData.secondLastName" value="PRUEBA"/><input type="hidden" name="certEmail" value="gestoria@example.com"/></form>`,
    ),
    htmlResponse(
      `${site}api/validate/sociedad`,
      '{"name":"EJEMPLO ACTIVIDADES SL","provinceCodes":[10],"valid":true}',
    ),
    htmlResponse(
      `${site}api/location/towns`,
      '[{"value":1,"label":"Abadía"},{"value":37,"label":"Cáceres"}]',
    ),
  ]
}
