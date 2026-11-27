import { isSpanishDate } from '../../dates/isSpanishDate'
import type { HttpClient } from '../../http/types/HttpClient'
import { emitAffiliationReport } from './emitAffiliationReport'
import type { EmploymentAtDateResult } from './types/EmploymentAtDateResult'

/**
 * Emit the "informe de alta laboral a fecha concreta" (service INAF0009) for
 * one date and download its PDF: the screen's `fecha` field plus its
 * `ACEPTAR_INFORME_FECHA_CONCRETA` button.
 */
export const emitEmploymentAtDate = async (
  client: HttpClient,
  fecha: string,
  outDir: string | undefined,
): Promise<EmploymentAtDateResult> => {
  if (!isSpanishDate(fecha))
    throw new Error('TGSS: --fecha must be a date as DD/MM/AAAA')
  const report = await emitAffiliationReport(
    client,
    {
      app: 'INAF0009',
      kind: 'alta',
      action: 'ACEPTAR_INFORME_FECHA_CONCRETA',
      fields: { fecha },
      notes: [
        'the informe states whether the holder was registered (alta) on that date; it is emitted on request',
      ],
    },
    outDir,
  )
  return { ...report, fecha }
}
