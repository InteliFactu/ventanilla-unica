/** Absolute URLs the OARGT (`sede.oargt.es`) receipt and liquidation reads touch. */
export const oargtUrls = {
  public:
    'https://sede.oargt.es/sta/CarpetaPublic/public?APP_CODE=STA&PAGE_CODE=OARGT_OVC',
  recibosCertificate:
    'https://sede.oargt.es/sta/CarpetaPrivate/Certificate?APP_CODE=STA&PAGE_CODE=RECIBOS',
  liquidacionesCertificate:
    'https://sede.oargt.es/sta/CarpetaPrivate/Certificate?APP_CODE=STA&PAGE_CODE=LISTALIQ',
  submitAjax: 'https://sede.oargt.es/sta/CarpetaPrivate/submitAjax.aa',
} as const
