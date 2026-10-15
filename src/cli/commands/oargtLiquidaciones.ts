import { listOargtLiquidations } from '../../oargt/liquidations/listOargtLiquidations'
import type { Command } from '../types/Command'

/** `ventanilla-unica oargt liquidaciones`: whether the holder has OARGT liquidations. */
export const oargtLiquidaciones: Command = {
  portal: 'oargt',
  action: 'liquidaciones',
  description:
    'Whether the holder has liquidations ("Mis liquidaciones") at OARGT Caceres, own or as representative; refuses, reading nothing, when the list has rows (their layout is not captured yet)',
  options: [],
  run: async (client) => listOargtLiquidations(client),
}
