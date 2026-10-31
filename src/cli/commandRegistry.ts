import { aeatCommands } from './aeatCommands'
import { caceresCommands } from './caceresCommands'
import { carpetaCommands } from './carpetaCommands'
import { calendarioFiscal } from './commands/calendarioFiscal'
import { cirbeEstado } from './commands/cirbeEstado'
import { cirbeInforme } from './commands/cirbeInforme'
import { dgsfpReclamacion } from './commands/dgsfpReclamacion'
import { dgtContacto } from './commands/dgtContacto'
import { dgtDatos } from './commands/dgtDatos'
import { dgtDomicilio } from './commands/dgtDomicilio'
import { dgtSanciones } from './commands/dgtSanciones'
import { dgtVehiculos } from './commands/dgtVehiculos'
import { firmarPdf } from './commands/firmarPdf'
import { firmarXml } from './commands/firmarXml'
import { justiciaDocumentos } from './commands/justiciaDocumentos'
import { justiciaExpedientes } from './commands/justiciaExpedientes'
import { nicCorreo } from './commands/nicCorreo'
import { oargtDatosContacto } from './commands/oargtDatosContacto'
import { oargtLiquidaciones } from './commands/oargtLiquidaciones'
import { oargtRecibos } from './commands/oargtRecibos'
import { placspEstado } from './commands/placspEstado'
import { placspPregunta } from './commands/placspPregunta'
import { registradoresNota } from './commands/registradoresNota'
import { roleceEstado } from './commands/roleceEstado'
import { roleceSolicitud } from './commands/roleceSolicitud'
import { sepeCertificado } from './commands/sepeCertificado'
import { sepePrestacion } from './commands/sepePrestacion'
import { teaExpedientes } from './commands/teaExpedientes'
import { validarNif } from './commands/validarNif'
import { dehuCommands } from './dehuCommands'
import { ineCommands } from './ineCommands'
import { juntaCommands } from './juntaCommands'
import { rayuelaCommands } from './rayuelaCommands'
import { regCommands } from './regCommands'
import { tgssCommands } from './tgssCommands'
import type { Command } from './types/Command'

export const commandRegistry: readonly Command[] = [
  ...aeatCommands,
  ...tgssCommands,
  ...dehuCommands,
  ...carpetaCommands,
  oargtRecibos,
  oargtLiquidaciones,
  oargtDatosContacto,
  teaExpedientes,
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
  dgtSanciones,
  dgtVehiculos,
  dgtContacto,
  dgtDomicilio,
  justiciaExpedientes,
  justiciaDocumentos,
  nicCorreo,
  registradoresNota,
  ...regCommands,
  ...rayuelaCommands,
  firmarPdf,
  firmarXml,
  validarNif,
  calendarioFiscal,
]
