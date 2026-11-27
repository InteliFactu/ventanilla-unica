import { accountPaymentFixture as fx } from './accountPaymentFixture'

/** The MisPagos row of the fixture justificante, already paid. */
export const misPagosPaidRowHtml = `<tr><td>Liquidación</td><td>010</td><td>${fx.justificante}</td><td>50,00</td><td>1583</td><td>06/11/2026</td><td><a href='ImpresionPDF?nrc=${fx.nrc}'>Descargar</a></td></tr>`
