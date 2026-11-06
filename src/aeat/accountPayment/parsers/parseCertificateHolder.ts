import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'
import type { CertificateHolder } from '../types/CertificateHolder'

/** The nifCert and nomCert hidden inputs the form prints outside its own `<form>`. */
export const parseCertificateHolder = (
  html: string,
): CertificateHolder | undefined => {
  const nifTag = /<input\s[^>]*name=['"]nifCert['"][^>]*>/.exec(html)?.[0]
  const nameTag = /<input\s[^>]*name=['"]nomCert['"][^>]*>/.exec(html)?.[0]
  const nif = nifTag && readAttribute(nifTag, 'value')
  const nombre = nameTag && readAttribute(nameTag, 'value')
  return nif && nombre ? { nif, nombre: unescapeHtml(nombre) } : undefined
}
