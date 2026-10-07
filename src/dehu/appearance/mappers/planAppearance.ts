/** The steps `dehu comparecer` takes for each pending notification, stated before anything runs. */
export const planAppearance = (ids: readonly string[]): readonly string[] => [
  `For each of ${ids.join(', ')} still pending at DEHU:`,
  'GET get_legal_text/1/es: the id of the access legal text consented to.',
  'GET notifications/<ref>/appearance-login-form/aceptar/<legal text>, then the Cl@ve relay with the certificate: a fresh bearer from appearance-login-check.',
  'POST notifications/<ref>/voucher {"operation":"aceptar"}: the comparecencia. The notification counts as notified today and every legal deadline it carries (recurso, alegaciones, pago) starts counting.',
  'With --out: GET realized_notifications/<ref>/document and /voucher, the act and the acuse.',
]
