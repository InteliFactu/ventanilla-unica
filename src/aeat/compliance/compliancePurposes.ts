import type { CompliancePurpose } from './types/CompliancePurpose'
import type { CompliancePurposeInfo } from './types/CompliancePurposeInfo'

/**
 * The `fTipoCertificado` radios of ECOTInternetCiudadanosServlet, read live
 * on 2026-10-03. T1 (transport permits) and E1 (work and residence permits
 * for foreigners) exist too and are not offered.
 */
export const compliancePurposes: Readonly<
  Record<CompliancePurpose, CompliancePurposeInfo>
> = {
  contratacion: {
    value: 'C1',
    label: 'para contratar con el sector público',
  },
  subvenciones: {
    value: 'B1',
    label: 'para obtener subvenciones públicas',
  },
  generico: {
    value: 'G1',
    label: 'genérico',
  },
}
