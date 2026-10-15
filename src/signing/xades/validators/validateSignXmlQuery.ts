import type { SignXmlFileRequest } from '../types/SignXmlFileRequest'
import { validateSignXmlPolicyName } from './validateSignXmlPolicyName'
import { validateXadesMode } from './validateXadesMode'

/** Check the `ventanilla-unica firmar xml` options before touching any file. */
export const validateSignXmlQuery = (
  options: Readonly<Record<string, string | undefined>>,
): SignXmlFileRequest => {
  const input = options['in']
  const output = options['out']
  if (!input) throw new Error('--in is required (the file to sign)')
  if (!output) throw new Error('--out is required (the signed file)')
  if (input === output) throw new Error('--out must differ from --in')
  return {
    input,
    output,
    mode: validateXadesMode(options['modo']),
    policy: validateSignXmlPolicyName(options['politica']),
    timestamp: options['tsa'] ? { url: options['tsa'] } : undefined,
  }
}
