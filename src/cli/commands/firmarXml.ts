import { signXmlFile } from '../../signing/xades/signXmlFile'
import { validateSignXmlQuery } from '../../signing/xades/validators/validateSignXmlQuery'
import type { Command } from '../types/Command'

export const firmarXml: Command = {
  portal: 'firmar',
  action: 'xml',
  description:
    'Sign an XML file locally as XAdES (--modo enveloped|enveloping|detached, --politica facturae|age|ninguna) into --out',
  options: ['in', 'modo', 'politica'],
  effect: 'sign',
  run: async (_client, options, identity): Promise<unknown> => {
    const request = validateSignXmlQuery(options)
    if (identity === undefined)
      throw new Error('firmar xml needs the holder certificate (--cert/--key)')
    return signXmlFile(request, identity)
  },
}
