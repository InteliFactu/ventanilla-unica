/* eslint-disable security/detect-non-literal-fs-filename -- every path is under the temp dir this fixture creates */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** Verify a signed XML with xmlsec1 (a detached original is written as invoice.xml beside it); throws on failure. */
export const xmlsecVerifies = (xml: Buffer, detached?: Buffer): string => {
  const dir = mkdtempSync(join(tmpdir(), 'ventanilla-unica-xades-'))
  if (detached) writeFileSync(join(dir, 'invoice.xml'), detached)
  writeFileSync(join(dir, 'signed.xml'), xml)
  return execFileSync(
    'xmlsec1',
    [
      '--verify',
      '--insecure',
      '--enabled-reference-uris',
      'empty,same-doc,local,remote',
      ...[
        'http://uri.etsi.org/01903/v1.3.2#:SignedProperties',
        'http://www.w3.org/2000/09/xmldsig#:KeyInfo',
        'http://www.w3.org/2000/09/xmldsig#:Object',
        'CONTENT',
      ].flatMap((node) => ['--id-attr:Id', node]),
      'signed.xml',
    ],
    { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
}
