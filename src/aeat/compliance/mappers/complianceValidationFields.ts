import type { FormFieldPair } from '../../census/types/FormFieldPair'

/**
 * The `fAccion=2` body of ECOTInternetCiudadanosServlet: validate a request
 * for the holder itself (fTipoRepresentacion=1, no third party) as of today
 * (fMomentoDeterminacionEcot=1, so fFechaPasada stays empty).
 */
export const complianceValidationFields = (
  islw: string,
  certificateType: string,
): readonly FormFieldPair[] => [
  ['fTipoRepresentacion', '1'],
  ['fNifT', ''],
  ['fNombreT', ''],
  ['fTipoCertificado', certificateType],
  ['fMomentoDeterminacionEcot', '1'],
  ['fFechaPasada', ''],
  ['fAccion', '2'],
  ['fIslw', islw],
  ['validarSolicitud', 'Validar solicitud'],
]
