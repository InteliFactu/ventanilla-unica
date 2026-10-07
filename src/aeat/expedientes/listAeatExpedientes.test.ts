import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { listAeatExpedientes } from './listAeatExpedientes'

const page = (text: string, url: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})

describe('listAeatExpedientes', () => {
  it('reads a represented holder, its list and acts without opening an act', async () => {
    const request = vi.fn(async (url: string) => {
      if (url.endsWith('/BUGC-JDIT/MdcAcceso'))
        return Promise.resolve(page('', url))
      if (url.endsWith('/TEWV-CORE/ResumenVlt'))
        return Promise.resolve(
          page(
            `<title>Mis expedientes B00000000</title><span>1 expediente</span><table title='Listado de expedientes asociados'><tr><td>2024</td><td>Limited review</td><td>Finalizado</td><td>03/04/2025</td><td><a href="https://www1.agenciatributaria.gob.es/wlpl/TEWV-CORE/DetalleVlt?evt=2025EVTTEST0001">2024CMP000001</a></td></tr></table>`,
            url,
          ),
        )
      if (url.includes('/TEWV-CORE/DetalleVlt?evt='))
        return Promise.resolve(
          page(
            `<title>Detalle 2024CMP000001</title><h2>Historia del Expediente</h2><ul><li>01-02-2025 <a href="https://www2.agenciatributaria.gob.es/wlpl/KATA-APLI/cotejo/CotejoSv?CSV=FAKE">Requerimiento</a></li></ul><ul><li>03-04-2025 <a href="https://www2.agenciatributaria.gob.es/wlpl/KATA-APLI/cotejo/CotejoSv?CSV=FAKE2">Terminación de procedimiento</a></li></ul><h2>Información Adicional</h2>`,
            url,
          ),
        )
      throw new Error(`Unexpected request: ${url}`)
    })
    const client: HttpClient = { request, cookie: () => undefined }

    const report = await listAeatExpedientes(client, 'B00000000')

    expect(report.count).toBe(1)
    expect(report.expedientes[0]).toMatchObject({
      reference: '2024CMP000001',
      status: 'Finalizado',
      startDate: null,
      endDate: '2025-04-03',
      acts: [
        { date: '2025-02-01', description: 'Requerimiento' },
        { date: '2025-04-03', description: 'Terminación de procedimiento' },
      ],
    })
    expect(request).toHaveBeenCalledTimes(3)
  })

  it('rejects a list for another holder', async () => {
    const request = vi.fn(async (url: string) =>
      Promise.resolve(page('<title>Mis expedientes C00000000</title>', url)),
    )
    const client: HttpClient = { request, cookie: () => undefined }
    await expect(listAeatExpedientes(client, 'B00000000')).rejects.toThrow(
      'not showing holder',
    )
  })
})
