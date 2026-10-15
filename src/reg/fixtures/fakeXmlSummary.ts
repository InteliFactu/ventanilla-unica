/** Base64 of the entry summary the fake API asks to sign. */
export const fakeXmlSummary = Buffer.from(
  '<resumen><asunto>Escrito</asunto></resumen>',
).toString('base64')
