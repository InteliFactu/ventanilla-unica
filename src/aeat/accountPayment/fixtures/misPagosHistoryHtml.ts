import { misPagosHeaderHtml } from './misPagosHeaderHtml'

/** The documented payment columns with server-rendered rows, using invented data. */
export const misPagosHistoryHtml = (
  rows = '<tr><td>Liquidación</td><td>010</td><td>010000000002B</td><td>3,00 €</td><td>1583</td><td>06/11/2026</td><td><a href="ImpresionPDF?nrc=010000000002BXYZ123456">Descargar</a></td></tr>',
): string => `${misPagosHeaderHtml}
<table><thead><tr><th>Tipo</th><th>Modelo/Ej/Periodo</th><th>Nº Justificante</th><th>Importe</th><th>Entidad</th><th>Fecha</th><th>Justificante</th></tr></thead><tbody>${rows}</tbody></table>`
