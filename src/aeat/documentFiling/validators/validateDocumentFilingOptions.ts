import type { CliOptions } from '../../../cli/types/CliOptions'
import type { DocumentFilingQuery } from '../types/DocumentFilingQuery'
import { validateCsvOption } from './validateCsvOption'
import { validateFilesOption } from './validateFilesOption'
import { validatePhoneOption } from './validatePhoneOption'
import { validateRoleOption } from './validateRoleOption'
import { validateSubjectOption } from './validateSubjectOption'

/** The `aeat aportar` options as a query, every one checked before the portal is touched. */
export const validateDocumentFilingOptions = (
  options: CliOptions,
): DocumentFilingQuery => ({
  csv: validateCsvOption(options['csv']),
  role: validateRoleOption(options['como']),
  subject: validateSubjectOption(options['asunto']),
  phone: validatePhoneOption(options['telefono']),
  email: options['correo'],
  files: validateFilesOption(options['documentos'], options['tipos']),
})
