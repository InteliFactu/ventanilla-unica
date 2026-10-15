/** The `frame.jsp` body the catalogue's "Tramitar" link posts to open a procedure's Relec form inside the sede frame. */
export const buildFrameForm = (
  procedure: string,
): Readonly<Record<string, string>> => ({
  eventScreenId: '',
  eventComponent: '',
  eventObject: '',
  eventAction: '',
  eventArguments: '',
  PAGE_CODE: 'CATALOGO',
  APP_CODE: 'STA',
  PAGE_COMPLETE: '',
  ROOTID: '1',
  HFC: 'HEADER#FOOTER',
  SESSION_REQUIRED: 'false',
  dboidSolicitud: procedure,
  autoFirma: 'true',
  fire: 'false',
  url: 'Relec/TramitaForm',
  urlBack: ` /sta/CarpetaPublic/?APP_CODE=STA&PAGE_CODE=CATALOGO&DETALLE=${procedure}`,
})
