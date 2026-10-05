import type { DgsfpFileValue } from './DgsfpFileValue'

/**
 * A field's value as the page's `ValorCampo` holds it. Key order follows the
 * page's class so the serialised form matches what a browser sends; `multiple`
 * and `tabla` are absent (undefined) once a non-file control has been set.
 */
export type DgsfpFieldValue = {
  readonly nombre: string
  readonly etiqueta: string
  readonly tipo: string
  readonly key: string
  readonly value: string
  readonly visible: boolean
  readonly deshabilitado: boolean
  readonly ocultarInformeFinal: boolean
  readonly multiple?: readonly DgsfpFileValue[] | undefined
  readonly tabla?: readonly never[] | undefined
}
