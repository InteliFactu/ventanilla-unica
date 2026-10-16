import type { NotaQuery } from '../types/NotaQuery'
import type { PreparedNota } from '../types/PreparedNota'

/** The plan lines: what was found, and every request the order would send with its values. */
export const mapNotaPlan = (
  query: NotaQuery,
  prepared: PreparedNota,
): string[] => {
  const { company } = prepared
  return [
    `company: ${company.name} (${company.nif}), IRUS ${company.irus}, Registro Mercantil de ${company.registry}, ${company.status}`,
    prepared.accountsDepositAvailable
      ? 'accounts deposit: available'
      : 'accounts deposit: none available ("no tiene depósito de cuentas disponibles")',
    `nota informativa mercantil: datos generales + ${query.segments.join(', ')}`,
    `billing town: ${prepared.place.townName} (province ${prepared.place.provinceCode}, town ${prepared.place.townCode})`,
    'POST site/invitado/confirmar-identificacion-invitado (creates the order and shows the price):',
    ...Object.entries(prepared.identification).map(
      ([name, value]) => `  ${name}=${value}`,
    ),
    'POST site/certificado/solicitud/pagar paymentType=CARD termsAndConditionsCheckout=on',
    'GET site/certificado/solicitud/orden-completa until true, then site/certificado/solicitud/pago-orden for the hosted checkout URL (printed, never paid)',
  ]
}
