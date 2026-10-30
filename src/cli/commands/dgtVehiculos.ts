import { readVehicles } from '../../dgt/vehicles/readVehicles'
import type { Command } from '../types/Command'

export const dgtVehiculos: Command = {
  portal: 'dgt',
  action: 'vehiculos',
  description:
    'The vehicles the DGT has registered to the holder in Mi DGT ("Mis vehículos"): plate, first registration, make, model and fuel',
  options: [],
  run: async (client): Promise<unknown> => readVehicles(client),
}
