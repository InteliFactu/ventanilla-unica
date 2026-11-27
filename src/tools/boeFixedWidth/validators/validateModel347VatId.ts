import { model347VatFormats } from '../layouts/model347VatFormats'

/** The optional Community VAT identifier is mutually exclusive with a Spanish NIF. */
export const validateModel347VatId = (record: string): readonly string[] => {
  const vatId = record.slice(263, 280).trimEnd()
  if (!vatId) return []
  if (!model347VatFormats.get(vatId.slice(0, 2))?.test(vatId.slice(2)))
    return [
      'nifComunitario (264-280): expected a supported VAT country prefix and identifier',
    ]
  if (record.slice(17, 26).trim())
    return ['nifComunitario (264-280): only one tax identifier can be supplied']
  return []
}
