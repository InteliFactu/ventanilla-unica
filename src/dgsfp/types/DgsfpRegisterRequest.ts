import type { DgsfpAttachedFile } from './DgsfpAttachedFile'

/** The body of `registrarPresentacionTelematica` (`PeticionRegistrarPresentacion`). */
export type DgsfpRegisterRequest = {
  readonly ficherosAdjuntos: readonly DgsfpAttachedFile[]
  readonly ficherosAdjuntosConNombreAsociado: readonly never[]
  readonly documentosExtranet: readonly never[]
  readonly accionesFormulario: readonly never[]
  readonly formularioPdfB64: string
  readonly formularioPdfFirmadoB64: string
  readonly certificadoUsuarioFirmaB64: string
  readonly tituloPresentacion: string
  readonly numTelematico: string
  readonly datosFormulario: string
  readonly ficherosInformesPlanes: readonly never[]
}
