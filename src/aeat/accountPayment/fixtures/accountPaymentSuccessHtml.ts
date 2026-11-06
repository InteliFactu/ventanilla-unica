import { accountPaymentFixture } from './accountPaymentFixture'

/**
 * The final page of a paid liquidación. Not yet seen live for the account
 * flow: modelled on the card flow's "El pago ha sido realizado con éxito. El
 * NRC generado es: <NRC>" and the hidden `nrc` input its script reads.
 */
export const accountPaymentSuccessHtml = `
<p>El pago ha sido realizado con éxito. El NRC generado es: <strong>${accountPaymentFixture.nrc}</strong></p>
<input type='hidden' id='nrc' name='nrc' value='${accountPaymentFixture.nrc}'/>`
