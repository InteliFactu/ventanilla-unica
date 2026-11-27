/* eslint-disable security/detect-non-literal-fs-filename -- both files are in this test's temporary directory */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** Verify the SOAP body using the independently supplied signer certificate. */
export const verifyFaceSoapWithXmlsec = (
  soap: Buffer,
  cert: string | Buffer,
): void => {
  const cwd = mkdtempSync(join(tmpdir(), 'ventanilla-unica-face-'))
  writeFileSync(join(cwd, 'request.xml'), soap)
  writeFileSync(join(cwd, 'test.pem'), cert)
  const supportsLaxKeySearch = execFileSync('xmlsec1', ['--help-verify'], {
    encoding: 'utf8',
  }).includes('--lax-key-search')
  execFileSync(
    'xmlsec1',
    [
      '--verify',
      ...(supportsLaxKeySearch ? ['--lax-key-search'] : []),
      '--pubkey-cert-pem',
      'test.pem',
      '--enabled-reference-uris',
      'same-doc',
      '--id-attr:Id',
      'http://schemas.xmlsoap.org/soap/envelope/:Body',
      'request.xml',
    ],
    { cwd, stdio: ['ignore', 'pipe', 'pipe'] },
  )
}
