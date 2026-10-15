import { caceresCommands } from './caceresCommands'
import { carpetaCommands } from './carpetaCommands'
import { aeatAportar } from './commands/aeatAportar'
import { aeatBaja } from './commands/aeatBaja'
import { aeatBorradorAutoliquidacion } from './commands/aeatBorradorAutoliquidacion'
import { aeatCartaPago } from './commands/aeatCartaPago'
import { aeatCertificadoCensal } from './commands/aeatCertificadoCensal'
import { aeatCertificadoCorriente } from './commands/aeatCertificadoCorriente'
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
import { calendarioFiscal } from './commands/calendarioFiscal'
import { cirbeEstado } from './commands/cirbeEstado'
import { cirbeInforme } from './commands/cirbeInforme'
import { dgsfpReclamacion } from './commands/dgsfpReclamacion'
import { dgtContacto } from './commands/dgtContacto'
import { dgtDatos } from './commands/dgtDatos'
import { firmarPdf } from './commands/firmarPdf'
import { firmarXml } from './commands/firmarXml'
import { justiciaDocumentos } from './commands/justiciaDocumentos'
import { justiciaExpedientes } from './commands/justiciaExpedientes'
import { nicCorreo } from './commands/nicCorreo'
import { oargtRecibos } from './commands/oargtRecibos'
import { placspEstado } from './commands/placspEstado'
import { placspPregunta } from './commands/placspPregunta'
import { roleceEstado } from './commands/roleceEstado'
import { roleceSolicitud } from './commands/roleceSolicitud'
import { sepeCertificado } from './commands/sepeCertificado'
import { sepePrestacion } from './commands/sepePrestacion'
import { validarNif } from './commands/validarNif'
import { dehuCommands } from './dehuCommands'
import { ineCommands } from './ineCommands'
import { juntaCommands } from './juntaCommands'
import { regCommands } from './regCommands'
import { tgssCommands } from './tgssCommands'
import type { Command } from './types/Command'

export const commandRegistry: readonly Command[] = [
  aeatDeudas,
  aeatExpedientes,
  aeatPagos,
  aeatDeclaraciones,
  aeatInformativas,
  aeatCertificadoCensal,
  aeatCertificadoCorriente,
  aeatContacto,
  aeatComparecer,
  aeatCartaPago,
  aeatDomicilio,
  aeatBaja,
  aeatAportar,
  aeatInformativa,
  aeatModelo190,
  aeatBorradorAutoliquidacion,
  ...tgssCommands,
  ...dehuCommands,
  ...carpetaCommands,
  oargtRecibos,
  ...juntaCommands,
  ...caceresCommands,
  ...ineCommands,
  sepePrestacion,
  sepeCertificado,
  cirbeInforme,
  cirbeEstado,
  roleceEstado,
  roleceSolicitud,
  placspEstado,
  placspPregunta,
  dgsfpReclamacion,
  dgtDatos,
  dgtContacto,
  justiciaExpedientes,
  justiciaDocumentos,
  nicCorreo,
  ...regCommands,
  firmarPdf,
  firmarXml,
  validarNif,
  calendarioFiscal,
]
