/**
 * The DGSFP sede (SharePoint). The procedure page is public; the form page
 * lives under the authenticated `/es/Auth` web, whose `_vti_bin` services the
 * form calls. Uploads go to the site root's FilePond service, as the page's
 * `processUrl` constant says. Procedure 14 is "Presentación de quejas y
 * reclamaciones", telematic number TEL43.
 */
export const dgsfpUrls = {
  origin: 'https://www.sededgsfp.gob.es',
  procedurePage:
    'https://www.sededgsfp.gob.es/es/Paginas/Procedimiento.aspx?pr=14',
  formPage:
    'https://www.sededgsfp.gob.es/es/Auth/Paginas/FormularioProcedimiento.aspx?pr=14',
  claveRequest:
    'https://www.sededgsfp.gob.es/_vti_bin/DGSFP.SedeElectronica/RestService.svc/createClave2Request?u=',
  authServices:
    'https://www.sededgsfp.gob.es/es/Auth/_vti_bin/DGSFP.SedeElectronica',
  upload:
    'https://www.sededgsfp.gob.es/_vti_bin/DGSFP.SedeElectronica/Files/FilePondRestService.svc/process',
  claveOrigin: 'https://pasarela.clave.gob.es',
  certificateIdp: 'AFIRMA',
  procedureId: 14,
} as const
