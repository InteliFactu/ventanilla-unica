import { aeatCartaPago } from './commands/aeatCartaPago'
import { aeatCertificadoCensal } from './commands/aeatCertificadoCensal'
import { aeatCertificadoCorriente } from './commands/aeatCertificadoCorriente'
import { aeatComparecer } from './commands/aeatComparecer'
import { aeatDeclaraciones } from './commands/aeatDeclaraciones'
import { aeatDeudas } from './commands/aeatDeudas'
import { aeatDomicilio } from './commands/aeatDomicilio'
import { aeatInformativas } from './commands/aeatInformativas'
import { aeatPagos } from './commands/aeatPagos'
import { caceresExpedientes } from './commands/caceresExpedientes'
import { caceresNotificaciones } from './commands/caceresNotificaciones'
import { caceresRegistros } from './commands/caceresRegistros'
import { calendarioFiscal } from './commands/calendarioFiscal'
import { cirbeEstado } from './commands/cirbeEstado'
import { cirbeInforme } from './commands/cirbeInforme'
import { dehuDocumentos } from './commands/dehuDocumentos'
import { dehuList } from './commands/dehuList'
import { firmarPdf } from './commands/firmarPdf'
import { firmarXml } from './commands/firmarXml'
import { juntaCarpetaExpedientes } from './commands/juntaCarpetaExpedientes'
import { juntaCarpetaNotificaciones } from './commands/juntaCarpetaNotificaciones'
import { juntaDeudas } from './commands/juntaDeudas'
import { juntaDocumentos } from './commands/juntaDocumentos'
import { juntaExpedientes } from './commands/juntaExpedientes'
import { juntaNotificaciones } from './commands/juntaNotificaciones'
import { juntaPagos } from './commands/juntaPagos'
import { juntaRegistros } from './commands/juntaRegistros'
import { juntaRepresentados } from './commands/juntaRepresentados'
import { juntaTasas } from './commands/juntaTasas'
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
import { tgssCorriente } from './commands/tgssCorriente'
import { tgssDatos } from './commands/tgssDatos'
import { tgssDeuda } from './commands/tgssDeuda'
import { tgssEmpresario } from './commands/tgssEmpresario'
import { tgssNss } from './commands/tgssNss'
import { tgssSituacion } from './commands/tgssSituacion'
import { tgssVidaLaboral } from './commands/tgssVidaLaboral'
import { validarNif } from './commands/validarNif'
import type { Command } from './types/Command'

export const commandRegistry: readonly Command[] = [
  aeatDeudas,
  aeatPagos,
  aeatDeclaraciones,
  aeatInformativas,
  aeatCertificadoCensal,
  aeatCertificadoCorriente,
  aeatComparecer,
  aeatCartaPago,
  aeatDomicilio,
  tgssDeuda,
  tgssCorriente,
  tgssVidaLaboral,
  tgssSituacion,
  tgssNss,
  tgssDatos,
  tgssAlta,
  tgssEmpresario,
  tgssBases,
  tgssAplazamiento,
  tgssAdjuntar,
  dehuList,
  dehuDocumentos,
  oargtRecibos,
  juntaExpedientes,
  juntaNotificaciones,
  juntaRegistros,
  juntaDeudas,
  juntaTasas,
  juntaPagos,
  juntaCarpetaExpedientes,
  juntaCarpetaNotificaciones,
  juntaDocumentos,
  juntaRepresentados,
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
  firmarPdf,
  firmarXml,
  validarNif,
  calendarioFiscal,
]
