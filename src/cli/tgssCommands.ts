import { tgssAdjuntar } from './commands/tgssAdjuntar'
import { tgssAlta } from './commands/tgssAlta'
import { tgssAplazamiento } from './commands/tgssAplazamiento'
import { tgssBases } from './commands/tgssBases'
import { tgssCcc } from './commands/tgssCcc'
import { tgssContacto } from './commands/tgssContacto'
import { tgssCorriente } from './commands/tgssCorriente'
import { tgssDatos } from './commands/tgssDatos'
import { tgssDatosPersonales } from './commands/tgssDatosPersonales'
import { tgssDeuda } from './commands/tgssDeuda'
import { tgssDomicilio } from './commands/tgssDomicilio'
import { tgssEmpresario } from './commands/tgssEmpresario'
import { tgssNss } from './commands/tgssNss'
import { tgssSituacion } from './commands/tgssSituacion'
import { tgssVidaLaboral } from './commands/tgssVidaLaboral'
import type { Command } from './types/Command'

/** The Seguridad Social commands: Prosa reports and certificates, Importass personal data, and the CEUS writes. */
export const tgssCommands: readonly Command[] = [
  tgssDeuda,
  tgssCorriente,
  tgssVidaLaboral,
  tgssSituacion,
  tgssNss,
  tgssDatos,
  tgssDatosPersonales,
  tgssAlta,
  tgssEmpresario,
  tgssCcc,
  tgssBases,
  tgssAplazamiento,
  tgssAdjuntar,
  tgssContacto,
  tgssDomicilio,
]
