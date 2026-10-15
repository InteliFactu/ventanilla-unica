import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from './buildElement'
import { buildTextElement } from './buildTextElement'

/** xades:SignerRole with one ClaimedRole per role. */
export const buildSignerRole = (
  xades: string,
  roles: readonly string[],
): XmlElement =>
  buildElement(`${xades}:SignerRole`, {}, [
    buildElement(
      `${xades}:ClaimedRoles`,
      {},
      roles.map((role) => buildTextElement(`${xades}:ClaimedRole`, role)),
    ),
  ])
