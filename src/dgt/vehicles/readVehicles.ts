import type { HttpClient } from '../../http/types/HttpClient'
import { dgtUrls } from '../session/dgtUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { parseVehicleRows } from './parsers/parseVehicleRows'
import type { DgtVehicle } from './types/DgtVehicle'

/** The vehicles the DGT has registered to the holder ("Mis vehiculos"). Changes nothing. */
export const readVehicles = async (
  client: HttpClient,
): Promise<readonly DgtVehicle[]> => {
  const page = await loginWithCertificate(client, dgtUrls.vehiclesPage)
  if (!page.text.includes('Mis vehículos'))
    throw new Error(
      `DGT: ${page.url} is not "Mis vehículos"; the page changed or the session is not Mi DGT`,
    )
  return parseVehicleRows(page.text)
}
