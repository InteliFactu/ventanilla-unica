import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { readVehicles } from './readVehicles'

vi.mock('../session/loginWithCertificate')

const page = (rows: string): string =>
  `<title>Mis vehículos</title><table class="table tabla-vehiculos"><thead><tr><th>Matrícula</th></tr></thead><tbody>${rows}</tbody></table><table id="tabla_vmps"><tr><td data-th="Nº de placa">X</td></tr></table>`

describe('readVehicles', () => {
  it('reads every vehicle row and ignores the VMP table', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(
      htmlResponse(
        'https://sede.dgt.gob.es/es/mi_dgt/mis-vehiculos/',
        page(
          '<tr><td data-th="Matrícula"><a href="#"> 0000AAA</a></td><td data-th="Matriculación"> 01/01/2010</td><td data-th="Marca"> MARCA</td><td data-th="Modelo"> MODELO 1 &amp; 2</td><td data-th="Combustible"> DIESEL</td></tr>',
        ),
      ),
    )
    await expect(readVehicles(scriptedClient())).resolves.toEqual([
      {
        matricula: '0000AAA',
        matriculacion: '01/01/2010',
        marca: 'MARCA',
        modelo: 'MODELO 1 & 2',
        combustible: 'DIESEL',
      },
    ])
  })

  it('fails on a page that is not Mis vehiculos', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(
      htmlResponse('https://sede.dgt.gob.es/x', '<html></html>'),
    )
    await expect(readVehicles(scriptedClient())).rejects.toThrow('is not')
  })
})
