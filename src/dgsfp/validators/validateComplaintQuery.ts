import type { CliOptions } from '../../cli/types/CliOptions'
import { validateNif } from '../../tools/nif/validators/validateNif'
import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'
import { readComplaintOptions } from './readComplaintOptions'

/**
 * Check the options before any request. The form's declaration that the
 * complaint is not pending before a court or another body is the holder's
 * own statement, so it needs `--declaro-no-litigio si`.
 */
export const validateComplaintQuery = (
  options: CliOptions,
): DgsfpComplaintQuery => {
  const query = readComplaintOptions(options)
  const required = {
    entidad: query.entity,
    direccion: query.address,
    provincia: query.province,
    municipio: query.municipality,
    escrito: query.files.escrito,
    sac: query.files.sac,
  }
  const problems = [
    ...Object.entries(required)
      .filter(([, value]) => value === '')
      .map(([name]) => `--${name} is required`),
    validateNif(query.entityNif).valido
      ? ''
      : '--nif-entidad must be a valid NIF',
    /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(query.email)
      ? ''
      : '--email must be an e-mail address',
    /^\d{5}$/.test(query.postalCode)
      ? ''
      : '--cp must be a five-digit postcode',
    query.phone === '' || /^\d{9}$/.test(query.phone)
      ? ''
      : '--telefono must be nine digits',
    query.sacDate === undefined || /^\d{4}-\d{2}-\d{2}$/.test(query.sacDate)
      ? ''
      : '--fecha-sac must be YYYY-MM-DD',
    options['declaro-no-litigio'] === 'si'
      ? ''
      : '--declaro-no-litigio si is required: the form declares the complaint is not pending before a court, an arbitrator or another administrative body',
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return query
}
