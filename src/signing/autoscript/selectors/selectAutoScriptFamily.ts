import type { AutoScriptFamily } from '../types/AutoScriptFamily'

/**
 * The signer an AutoScript `format` names (`AOSignConstants`, clienteafirma
 * 0d7f3cf). The triphase variants (`CAdEStri`, `XAdEStri`, ...) sign the same
 * thing in three server round trips; here they are signed locally in one.
 * ASiC, OOXML, ODF and plain XMLDSig are refused.
 */
export const selectAutoScriptFamily = (format: string): AutoScriptFamily => {
  const name = format
    .trim()
    .toLowerCase()
    .replace(/-?tri$/, '')
  if (name === 'none' || name === 'pkcs1' || name === 'pkcs#1') return 'none'
  if (name === 'cades' || name === 'cms/pkcs#7') return 'cades'
  if (name === 'facturae') return 'facturae'
  if (name === 'pades' || name === 'adobe pdf') return 'pades'
  if (
    /^xades(?: (?:enveloped|enveloping|detached|externally detached))?$/.test(
      name,
    )
  )
    return 'xades'
  throw new Error(`unsupported AutoScript format: ${format}`)
}
