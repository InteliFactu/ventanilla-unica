import { aeatAportar } from './commands/aeatAportar'
import { aeatBaja } from './commands/aeatBaja'
import { aeatCartaPago } from './commands/aeatCartaPago'
import { aeatCertificadoCensal } from './commands/aeatCertificadoCensal'
import { aeatCertificadoCorriente } from './commands/aeatCertificadoCorriente'
import { aeatComparecer } from './commands/aeatComparecer'
import { aeatDeclaraciones } from './commands/aeatDeclaraciones'
import { aeatDeudas } from './commands/aeatDeudas'
import { aeatDomicilio } from './commands/aeatDomicilio'
import { aeatExpedientes } from './commands/aeatExpedientes'
import { aeatInformativa } from './commands/aeatInformativa'
import { aeatInformativas } from './commands/aeatInformativas'
import { aeatModelo190 } from './commands/aeatModelo190'
import { aeatPagos } from './commands/aeatPagos'
import { caceresExpedientes } from './commands/caceresExpedientes'
import { caceresNotificaciones } from './commands/caceresNotificaciones'
import { caceresRegistros } from './commands/caceresRegistros'
import { calendarioFiscal } from './commands/calendarioFiscal'
import { cirbeEstado } from './commands/cirbeEstado'
import { cirbeInforme } from './commands/cirbeInforme'
import { dehuComparecer } from './commands/dehuComparecer'
import { dehuDocumentos } from './commands/dehuDocumentos'
import { dehuList } from './commands/dehuList'
import { dgsfpReclamacion } from './commands/dgsfpReclamacion'
import { firmarPdf } from './commands/firmarPdf'
import { firmarXml } from './commands/firmarXml'
import { oargtRecibos } from './commands/oargtRecibos'
import { placspEstado } from './commands/placspEstado'
import { placspPregunta } from './commands/placspPregunta'
import { roleceEstado } from './commands/roleceEstado'
import { roleceSolicitud } from './commands/roleceSolicitud'
import { sepeCertificado } from './commands/sepeCertificado'
import { sepePrestacion } from './commands/sepePrestacion'
import { tgssAdjuntar } from './commands/tgssAdjuntar'
import { tgssAlta } from './commands/tgssAlta'
import { tgssAplazamiento } from './commands/tgssAplazamiento'
import { tgssBases } from './commands/tgssBases'
import { tgssCcc } from './commands/tgssCcc'
import { tgssCorriente } from './commands/tgssCorriente'
import { tgssDatos } from './commands/tgssDatos'
import { tgssDeuda } from './commands/tgssDeuda'
import { tgssEmpresario } from './commands/tgssEmpresario'
import { tgssNss } from './commands/tgssNss'
import { tgssSituacion } from './commands/tgssSituacion'
import { tgssVidaLaboral } from './commands/tgssVidaLaboral'
import { validarNif } from './commands/validarNif'
import { juntaCommands } from './juntaCommands'
import type { Command } from './types/Command'

export const commandRegistry: readonly Command[] = [
  aeatDeudas,
  aeatExpedientes,
  aeatPagos,
  aeatDeclaraciones,
  aeatInformativas,
  aeatCertificadoCensal,
  aeatCertificadoCorriente,
  aeatComparecer,
  aeatCartaPago,
  aeatDomicilio,
  aeatBaja,
  aeatAportar,
  aeatInformativa,
  aeatModelo190,
  tgssDeuda,
  tgssCorriente,
  tgssVidaLaboral,
  tgssSituacion,
  tgssNss,
  tgssDatos,
  tgssAlta,
  tgssEmpresario,
  tgssCcc,
  tgssBases,
  tgssAplazamiento,
  tgssAdjuntar,
  dehuList,
  dehuDocumentos,
  dehuComparecer,
  oargtRecibos,
  ...juntaCommands,
  caceresExpedientes,
  caceresNotificaciones,
  caceresRegistros,
  sepePrestacion,
  sepeCertificado,
  cirbeInforme,
  cirbeEstado,
  roleceEstado,
  roleceSolicitud,
  placspEstado,
  placspPregunta,
  dgsfpReclamacion,
  firmarPdf,
  firmarXml,
  validarNif,
  calendarioFiscal,
]
