import type { HttpClient } from '../../http/types/HttpClient'
import { fetchCertificateSearch } from '../fetchers/fetchCertificateSearch'
import { fetchRegistrationCheck } from '../fetchers/fetchRegistrationCheck'
import { mapRoleceStatusNotes } from '../mappers/mapRoleceStatusNotes'
import { readCertificateRows } from '../parsers/readCertificateRows'
import { readRegistrationCheck } from '../parsers/readRegistrationCheck'
import { openRoleceSession } from '../session/openRoleceSession'
import type { RoleceStatusResult } from '../types/RoleceStatusResult'

/**
 * Whether an operator is inscribed in ROLECE. The certificate search decides
 * (it names the operator, or says "NO INSCRITO EN EL REGISTRO"). For an
 * operator it does not know, the first screen of a legal-entity application
 * (a check that registers nothing) must agree that an initial application is
 * due, or say one is already pending; a disagreement is an error, not
 * something to resolve by guessing.
 */
export const readRoleceStatus = async (
  client: HttpClient,
  nif: string,
  outDir?: string,
): Promise<RoleceStatusResult> => {
  await openRoleceSession(client)
  const rows = readCertificateRows(
    (await fetchCertificateSearch(client, nif)).text,
  ).filter((row) => row.nif === nif)
  if (rows.length === 0)
    throw new Error(`ROLECE: the certificate search has no row for ${nif}`)
  const registered = rows.some((row) => row.inscribed)
  const check = registered
    ? undefined
    : readRegistrationCheck(await fetchRegistrationCheck(client, nif), nif)
  const initialApplication = check?.initialApplication ?? false
  const pendingApplication = check?.pendingApplication ?? false
  if (!registered && !initialApplication && !pendingApplication)
    throw new Error(
      `ROLECE: the certificate search says ${nif} is not inscribed, but the application screen does not offer an initial application`,
    )
  return {
    nif,
    registered,
    initialApplication,
    pendingApplication,
    certificate: { rows, downloaded: [] },
    notes: mapRoleceStatusNotes(registered, pendingApplication, outDir),
  }
}
