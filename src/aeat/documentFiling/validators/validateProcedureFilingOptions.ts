import type { CliOptions } from '../../../cli/types/CliOptions'
import type { ProcedureFilingQuery } from '../types/ProcedureFilingQuery'
import { validateFilesOption } from './validateFilesOption'
import { validateInteresadoNifOption } from './validateInteresadoNifOption'
import { validatePhoneOption } from './validatePhoneOption'
import { validateSubjectOption } from './validateSubjectOption'
import { validateTramiteOption } from './validateTramiteOption'

/** The `aeat escrito` options as a query, every one checked before the portal is touched. */
export const validateProcedureFilingOptions = (
  options: CliOptions,
): ProcedureFilingQuery => ({
  tramite: validateTramiteOption(options['tramite']),
  nif: validateInteresadoNifOption(options['nif']),
  subject: validateSubjectOption(options['asunto']),
  phone: validatePhoneOption(options['telefono']),
  email: options['correo'],
  files: validateFilesOption(options['documentos'], options['tipos']),
})
