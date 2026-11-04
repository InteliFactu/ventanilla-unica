/** Only these three address groups use cargarMunicipios.action. */
export const isYouthGuaranteeMunicipalityField = (name: string): boolean =>
  [
    'datosDireccionDomicilio',
    'datosDireccionContacto',
    'datosContacto.notificaApartadoCorreos',
  ].some((prefix) => name === `${prefix}.tcodMunicipio`)
