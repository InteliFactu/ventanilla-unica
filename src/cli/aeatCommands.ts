import { aeatActividades } from './commands/aeatActividades'
import { aeatApoderamientos } from './commands/aeatApoderamientos'
import { aeatAportar } from './commands/aeatAportar'
import { aeatBaja } from './commands/aeatBaja'
import { aeatBorradorAutoliquidacion } from './commands/aeatBorradorAutoliquidacion'
import { aeatCartaPago } from './commands/aeatCartaPago'
import { aeatCertificadoCensal } from './commands/aeatCertificadoCensal'
import { aeatCertificadoCorriente } from './commands/aeatCertificadoCorriente'
import { aeatCita } from './commands/aeatCita'
import { aeatComparecer } from './commands/aeatComparecer'
import { aeatContacto } from './commands/aeatContacto'
import { aeatCotejo } from './commands/aeatCotejo'
import { aeatDeclaraciones } from './commands/aeatDeclaraciones'
import { aeatDeudas } from './commands/aeatDeudas'
import { aeatDomicilio } from './commands/aeatDomicilio'
import { aeatEscrito } from './commands/aeatEscrito'
import { aeatExpedientes } from './commands/aeatExpedientes'
import { aeatInformativa } from './commands/aeatInformativa'
import { aeatInformativas } from './commands/aeatInformativas'
import { aeatModelo190 } from './commands/aeatModelo190'
import { aeatPagar } from './commands/aeatPagar'
import { aeatPagos } from './commands/aeatPagos'
import { aeatPresentarAutoliquidacion } from './commands/aeatPresentarAutoliquidacion'
import { aeatPresentarDeclaracion } from './commands/aeatPresentarDeclaracion'
import { aeatValidarAutoliquidacion } from './commands/aeatValidarAutoliquidacion'
import { aeatValidarDeclaracion } from './commands/aeatValidarDeclaracion'
import type { Command } from './types/Command'

/** AEAT command registration. */
export const aeatCommands: readonly Command[] = [
  aeatActividades,
  aeatApoderamientos,
  aeatAportar,
  aeatBaja,
  aeatBorradorAutoliquidacion,
  aeatCartaPago,
  aeatCertificadoCensal,
  aeatCertificadoCorriente,
  aeatCita,
  aeatComparecer,
  aeatContacto,
  aeatCotejo,
  aeatDeclaraciones,
  aeatDeudas,
  aeatDomicilio,
  aeatEscrito,
  aeatExpedientes,
  aeatInformativa,
  aeatInformativas,
  aeatModelo190,
  aeatPagar,
  aeatPagos,
  aeatPresentarAutoliquidacion,
  aeatPresentarDeclaracion,
  aeatValidarAutoliquidacion,
  aeatValidarDeclaracion,
]
