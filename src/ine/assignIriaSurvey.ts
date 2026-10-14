import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { readViewState } from '../gobex/notifications/parsers/readViewState'
import { postIriaAjax } from './fetchers/postIriaAjax'
import { readIriaMessages } from './parsers/readIriaMessages'
import { openIriaSession } from './session/openIriaSession'
import type { IriaAssignment } from './types/IriaAssignment'
import type { IriaAssignmentRequest } from './types/IriaAssignmentRequest'

/**
 * `ine asignar`: assign a survey to the IRIA account with the nº de orden and
 * contraseña of the INE letter, optionally asking IRIA to mail a notice when
 * each questionnaire opens ("¿Desea recibir un correo...?"). Without
 * confirmation it only returns the plan.
 */
export const assignIriaSurvey = async (
  identity: CertificateIdentity,
  request: IriaAssignmentRequest,
  confirmed: boolean,
): Promise<IriaAssignment> => {
  const plan = {
    numeroOrden: request.numeroOrden,
    avisoCorreo: request.avisoCorreo,
  }
  if (!confirmed) return { confirmed: false, ...plan, messages: [] }
  const { client, page } = await openIriaSession(identity)
  const viewState = readViewState(page.text)
  if (!viewState) throw new Error('IRIA: no ViewState after login')
  const answer = await postIriaAjax(client, page.url, {
    form: 'formTotal',
    source: 'formTotal:asignEncButton',
    render:
      'formTotal:asignEncButton formTotal:pAsgingEncNumOrden formTotal:pAsgingEncPassword formTotal:pErrors',
    viewState,
    fields: {
      'formTotal:asgingEncNumorden': request.numeroOrden,
      'formTotal:asgingEncContrasena': request.contrasena,
      ...(request.avisoCorreo ? { 'formTotal:recibirCorreo': 'on' } : {}),
    },
  })
  return { confirmed: true, ...plan, messages: readIriaMessages(answer.text) }
}
