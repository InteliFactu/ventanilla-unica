import type { DgsfpOption } from './DgsfpOption'

/** One control of the procedure's form definition, as `obtenerFormularioProcedimiento` and `ObtenerSeccion` describe it (only the members this client reads). */
export type DgsfpControl = {
  readonly nombre: string
  readonly tipo: string
  readonly etiqueta?: string | undefined
  readonly requerido?: boolean | undefined
  readonly deshabilitado?: boolean | undefined
  readonly ocultarInformeFinal?: boolean | undefined
  readonly oculto?: boolean | undefined
  readonly ValorPredeterminado?: unknown
  readonly TipoValorContexto?: string | undefined
  readonly opciones?: readonly DgsfpOption[] | undefined
}
