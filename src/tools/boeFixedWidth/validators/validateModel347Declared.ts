import { validateModel347VatId } from './validateModel347VatId'

/** Check the conditional fields of a D sheet, which has no equivalent on I. */
export const validateModel347Declared = (record: string): readonly string[] => {
  const problems = [...validateModel347VatId(record)]
  const country = record.slice(78, 80)
  if (
    !/^[A-Z]{2}$/.test(country) &&
    (country !== '  ' || record.slice(76, 78) === '99')
  )
    problems.push('pais (79-80): expected a two-letter country code')
  if (record.charAt(81) !== 'E' && record.slice(299, 305) !== '000000')
    problems.push(
      'convocatoriaBdns (300-305): only operation key E can use a BDNS code',
    )
  return problems
}
