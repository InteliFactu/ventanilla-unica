import { rootCertificates } from 'node:tls'

import { describe, expect, it } from 'vitest'

import { fnmtServerIntermediateCertificate } from './fnmtServerIntermediateCertificate'
import { fnmtServerRootCertificate } from './fnmtServerRootCertificate'
import { trustedCertificateAuthorities } from './trustedCertificateAuthorities'

describe('trustedCertificateAuthorities', () => {
  it("keeps Node's roots and adds the FNMT server root and intermediate", () => {
    expect(trustedCertificateAuthorities).toHaveLength(
      rootCertificates.length + 2,
    )
    expect(trustedCertificateAuthorities).toContain(fnmtServerRootCertificate)
    expect(trustedCertificateAuthorities).toContain(
      fnmtServerIntermediateCertificate,
    )
    expect(fnmtServerRootCertificate).toMatch(/^-----BEGIN CERTIFICATE-----/)
  })
})
