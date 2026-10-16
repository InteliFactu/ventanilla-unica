/**
 * The pago form: card payment, terms accepted, and the browser data the
 * checkout's 3-D Secure step reads (what a desktop browser in Madrid sends).
 */
export const notaPaymentFields: Readonly<Record<string, string>> = {
  'payerBrowserInfoForm.colorDepth': '24',
  'payerBrowserInfoForm.javaEnabled': 'false',
  'payerBrowserInfoForm.language': 'es-ES',
  'payerBrowserInfoForm.screenHeight': '1080',
  'payerBrowserInfoForm.screenWidth': '1920',
  'payerBrowserInfoForm.timeZone': '-120',
  paymentType: 'CARD',
  termsAndConditionsCheckout: 'on',
}
