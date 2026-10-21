import { aeatAportar } from './commands/aeatAportar'
import { aeatBaja } from './commands/aeatBaja'
import { aeatBorradorAutoliquidacion } from './commands/aeatBorradorAutoliquidacion'
import { aeatCartaPago } from './commands/aeatCartaPago'
import { aeatCertificadoCensal } from './commands/aeatCertificadoCensal'
import { aeatCertificadoCorriente } from './commands/aeatCertificadoCorriente'
import { aeatCita } from './commands/aeatCita'
import { aeatComparecer } from './commands/aeatComparecer'
import { aeatContacto } from './commands/aeatContacto'
import { aeatDeclaraciones } from './commands/aeatDeclaraciones'
import { aeatDeudas } from './commands/aeatDeudas'
import { aeatDomicilio } from './commands/aeatDomicilio'
import { aeatExpedientes } from './commands/aeatExpedientes'
import { aeatInformativa } from './commands/aeatInformativa'
import { aeatInformativas } from './commands/aeatInformativas'
import { aeatModelo190 } from './commands/aeatModelo190'
import { aeatPagos } from './commands/aeatPagos'
import type { Command } from './types/Command'

/** AEAT command registration. */
export const aeatCommands: readonly Command[] = [
  aeatAportar,
  aeatBaja,
  aeatBorradorAutoliquidacion,
  aeatCartaPago,
  aeatCertificadoCensal,
  aeatCertificadoCorriente,
  aeatCita,
  aeatComparecer,
  aeatContacto,
  aeatDeclaraciones,
  aeatDeudas,
  aeatDomicilio,
  aeatExpedientes,
  aeatInformativa,
  aeatInformativas,
  aeatModelo190,
  aeatPagos,
]
