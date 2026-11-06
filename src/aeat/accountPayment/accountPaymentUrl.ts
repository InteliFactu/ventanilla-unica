import { aeatBaseUrl } from '../session/aeatBaseUrl'

/**
 * "Liquidaciones/Deudas - Pago mediante cargo en cuenta". With a certificate
 * it is served from www1; www12 redirects to a Cl@ve PIN login and www2 is 404.
 */
export const accountPaymentUrl = `${aeatBaseUrl}/wlpl/OVPP-PAGO/LiquidacionesCuenta`
