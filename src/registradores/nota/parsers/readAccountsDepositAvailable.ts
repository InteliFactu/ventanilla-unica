import { htmlToText } from '../../../html/htmlToText'

/** False when the tipos-informacion page warns that the company "no tiene depósito de cuentas disponibles". */
export const readAccountsDepositAvailable = (html: string): boolean =>
  !htmlToText(html).includes('no tiene depósito de cuentas disponibles')
