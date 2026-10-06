import { aeatBaseUrl } from '../session/aeatBaseUrl'

/**
 * TGVI Online ("Transmisión de Grandes Volúmenes"), the sede's file
 * presentation of the informative returns (190, 347, 180...), and the
 * representation dialog that sets on whose behalf the session acts.
 */
export const bulkFilingUrls = {
  page: `${aeatBaseUrl}/wlpl/OVPT-NTGV/TGVIOnline`,
  initialize: `${aeatBaseUrl}/wlpl/OVPT-NTGV/InicializarEnvio`,
  send: `${aeatBaseUrl}/wlpl/OVPT-NTGV/EnviarDatos`,
  errors: `${aeatBaseUrl}/wlpl/OVPT-NTGV/RecuperarErrores`,
  signatureDialog: `${aeatBaseUrl}/wlpl/OVPT-NTGV/MostrarDlgFirma`,
  present: `${aeatBaseUrl}/wlpl/OVPT-NTGV/PresentarEnvio`,
  representation: `${aeatBaseUrl}/wlpl/OVCT-CXEW/DialogoRepresentacion`,
} as const
