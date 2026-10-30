/**
 * The "Cotejo de documentos mediante CSV" address that answers the document
 * itself, as a PDF, for a session opened with a certificate. `nif` is the
 * holder the document was issued to; the AEAT accepts it empty.
 */
export const aeatCsvDocumentUrl = (csv: string, nif: string): string =>
  `https://www2.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.eeca.catalogo.vis.VisualizaSc?COMPLETA=SI&ORIGEN=D&CSV=${encodeURIComponent(csv)}&NIF=${encodeURIComponent(nif)}`
