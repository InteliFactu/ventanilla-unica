import { generateKeyPairSync } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derNode } from '../asn1/derNode'
import { derNull } from '../asn1/derNull'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { derUtcTime } from '../asn1/derUtcTime'
import { cmsOids } from '../cms/cmsOids'
import { signData } from '../signData'

/**
 * A synthetic self-signed RSA certificate and key, built in memory for tests:
 * no real certificate and no private key ever lives in the repository.
 */
export const buildTestIdentity = (
  commonName = 'VENTANILLA UNICA TEST',
  nameOid: string = cmsOids.commonName,
): CertificateIdentity => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })
  const key = Buffer.from(privateKey.export({ type: 'pkcs8', format: 'pem' }))
  const name = derSequence([
    derSetOf([
      derSequence([
        derOid(nameOid),
        derNode(0x0c, Buffer.from(commonName, 'utf8')),
      ]),
    ]),
  ])
  const algorithm = derSequence([derOid(cmsOids.sha256WithRsa), derNull()])
  const tbs = derSequence([
    derContext(0, derInteger(2)),
    derInteger(Buffer.from([0x01, 0x23, 0x45])),
    algorithm,
    name,
    derSequence([
      derUtcTime(new Date('2026-01-01T00:00:00Z')),
      derUtcTime(new Date('2036-01-01T00:00:00Z')),
    ]),
    name,
    publicKey.export({ type: 'spki', format: 'der' }),
  ])
  const signature = signData({ cert: Buffer.alloc(0), key }, tbs, 'sha256')
  const der = derSequence([
    tbs,
    algorithm,
    derNode(0x03, Buffer.concat([Buffer.from([0]), signature])),
  ])
  const body = der.toString('base64').replaceAll(/(.{64})(?=.)/g, '$1\n')
  const cert = Buffer.from(
    `-----BEGIN CERTIFICATE-----\n${body}\n-----END CERTIFICATE-----\n`,
  )
  return { cert, key }
}
