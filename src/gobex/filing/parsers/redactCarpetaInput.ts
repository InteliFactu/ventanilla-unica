import { readAttribute } from '../../../html/readAttribute'

/** Remove one transient state/signature input while preserving visible evidence. */
export const redactCarpetaInput = (tag: string): string =>
  [
    'javax.faces.ViewState',
    'f_solicitud:firma',
    'f_solicitud:certificadoUsado',
  ].includes(readAttribute(tag, 'name') ?? '')
    ? '<input type="hidden" value="[redacted]" />'
    : tag
