import type { HttpClient } from '../../http/types/HttpClient'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { openRelecForm } from './fetchers/openRelecForm'
import { parseRelecSlots } from './parsers/parseRelecSlots'
import { parseRelecVariables } from './parsers/parseRelecVariables'
import { readRelecTramitaFields } from './parsers/readRelecTramitaFields'
import { readRelecTramitaFormControls } from './parsers/readRelecTramitaFormControls'
import { readRelecTramiteTextFields } from './parsers/readRelecTramiteTextFields'
import { selectEditableRelecVariables } from './selectors/selectEditableRelecVariables'
import type { RelecProcedureForm } from './types/RelecProcedureForm'

/**
 * `caceres procedimiento`: open one catalogue procedure's Relec form with the
 * certificate and report what it asks for (its "Solicito" fields and its
 * document rows). Opening the form files nothing.
 */
export const readRelecProcedure = async (
  client: HttpClient,
  dboid: string,
): Promise<RelecProcedureForm> => {
  const origin = staOrigins.caceres
  await openStaSession(client, origin)
  const page = await openRelecForm(client, origin, dboid)
  const controls = readRelecTramitaFormControls(page.text, page.url)
  const fields = readRelecTramitaFields(controls)
  const variables = parseRelecVariables(fields)
  return {
    host: new URL(origin).hostname,
    dboid,
    procedure: fields['solicituddesc']?.trim() ?? '',
    variables,
    editableFields: selectEditableRelecVariables(
      variables,
      readRelecTramiteTextFields(controls),
    ),
    slots: parseRelecSlots(fields),
  }
}
