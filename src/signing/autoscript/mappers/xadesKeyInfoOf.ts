import type { KeyInfoOptions } from '../../xades/types/KeyInfoOptions'
import type { ExtraParams } from '../types/ExtraParams'

/**
 * ds:KeyInfo as AutoFirma fills it by default (chain, RSA key value, signed),
 * each part switched off by its parameter.
 */
export const xadesKeyInfoOf = (params: ExtraParams): KeyInfoOptions => ({
  chain: params.get('includeOnlySignningCertificate') !== 'true',
  keyValue: params.get('addKeyInfoKeyValue') !== 'false',
  reference: params.get('keepKeyInfoUnsigned') !== 'true',
})
