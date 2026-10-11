import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { mapAddressFormFields } from './mappers/mapAddressFormFields'
import { readPersonalData } from './readPersonalData'
import type { AddressUpdate } from './types/AddressUpdate'
import { isSameAddress } from './validators/isSameAddress'

/**
 * Plan a change of the domicile the Seguridad Social holds (Importass
 * "Modificar domicilio"). Plan only: the save of that form has never been
 * captured, and the domicile can decide where a later self-employment alta is
 * located, so confirmation is refused before any request is made.
 */
export const planAddressChange = async (
  client: HttpClient,
  update: AddressUpdate,
  confirmed: boolean,
): Promise<WriteResult<never>> => {
  if (confirmed)
    throw new Error(
      'tgss domicilio cannot submit yet: the ACC_GUARDAR_DOMICILIO save has not been captured. Nothing was sent.',
    )
  const { data } = await readPersonalData(client)
  const holder = `Holder ${data.name} (${data.identifier}, NAF ${data.naf})`
  if (isSameAddress(data.address, update))
    return {
      action: 'tgss domicilio',
      executed: false,
      plan: [
        `${holder}: Importass already holds this domicile; nothing to change`,
      ],
      notes: [],
    }
  return {
    action: 'tgss domicilio',
    executed: false,
    plan: [
      holder,
      `Current domicile: ${data.address.lines.join(', ')}`,
      `POST the domicile form with ${JSON.stringify(mapAddressFormFields(update))}`,
    ],
    notes: ['Only the page was read; this command never submits the domicile.'],
  }
}
