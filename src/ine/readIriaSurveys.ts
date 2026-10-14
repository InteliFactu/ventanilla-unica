import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { parseIriaSurveys } from './parsers/parseIriaSurveys'
import { parseIriaUnit } from './parsers/parseIriaUnit'
import { openIriaSession } from './session/openIriaSession'
import type { IriaSurveysResult } from './types/IriaSurveysResult'

/**
 * `ine encuestas`: the surveys assigned to the IRIA account of the
 * certificate's NIF. With more than one survey IRIA lands on the survey list;
 * with only one it opens that survey's questionnaires directly, and the list
 * comes back empty with a note.
 */
export const readIriaSurveys = async (
  identity: CertificateIdentity,
): Promise<IriaSurveysResult> => {
  const { page } = await openIriaSession(identity)
  const encuestas = parseIriaSurveys(page.text)
  const notes =
    encuestas.length === 0
      ? [
          'IRIA opened a single survey directly; its questionnaires are on the web',
        ]
      : []
  return {
    unidad: parseIriaUnit(page.text),
    encuestas,
    pagina: page.url,
    notes,
  }
}
