import type { HttpClient } from '../../http/types/HttpClient'
import { dgsfpUrls } from '../session/dgsfpUrls'
import type { DgsfpProcedureAnswer } from '../types/DgsfpProcedureAnswer'
import type { DgsfpProcedureForm } from '../types/DgsfpProcedureForm'
import type { DgsfpProcedureFormJson } from '../types/DgsfpProcedureFormJson'
import { callDgsfpService } from './callDgsfpService'
import { fetchReusableSection } from './fetchReusableSection'

/**
 * The procedure's form with every reusable section resolved, as the page's
 * `componentDidMount` does before building its values: the form itself lists
 * some sections only by `seccionReutilizableId`.
 */
export const fetchProcedureForm = async (
  client: HttpClient,
  digest: string,
): Promise<DgsfpProcedureForm> => {
  const answer = (await callDgsfpService(
    client,
    digest,
    `RestService.svc/obtenerFormularioProcedimiento?pr=${String(dgsfpUrls.procedureId)}`,
  )) as DgsfpProcedureAnswer
  const form = JSON.parse(answer.jsonFormulario) as DgsfpProcedureFormJson
  const sections = await Promise.all(
    form.secciones.map(async (section) =>
      section.seccionReutilizableId === undefined
        ? section
        : fetchReusableSection(client, digest, section.seccionReutilizableId),
    ),
  )
  return {
    numTelematico: answer.numTelematico,
    titulo: answer.tituloProcedimiento,
    sections,
  }
}
