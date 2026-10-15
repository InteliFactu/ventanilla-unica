import type { XadesMode } from '../../xades/types/XadesMode'
import type { ExtraParams } from '../types/ExtraParams'

/**
 * The XAdES layout an AutoScript call asks for: the `format` parameter, else
 * the format itself, enveloping by default as in AutoFirma. "XAdES Detached"
 * is AutoFirma's internally detached; the AGE policy forces it unless
 * enveloped (`ExtraParamsProcessor`, clienteafirma 0d7f3cf).
 */
export const selectXadesMode = (
  format: string,
  params: ExtraParams,
  agePolicy: boolean,
): XadesMode => {
  const name = (params.get('format') ?? format).trim().toLowerCase()
  const mode: XadesMode =
    name === 'xades enveloped'
      ? 'enveloped'
      : name === 'xades detached'
        ? 'internally-detached'
        : name === 'xades externally detached'
          ? 'detached'
          : 'enveloping'
  if (agePolicy && mode !== 'enveloped') return 'internally-detached'
  return mode
}
