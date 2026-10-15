import type { SignXmlPolicyName } from '../types/SignXmlPolicyName'

/** `--politica`, ninguna when absent. */
export const validateSignXmlPolicyName = (
  value: string | undefined,
): SignXmlPolicyName => {
  const policy = value ?? 'ninguna'
  if (policy !== 'facturae' && policy !== 'age' && policy !== 'ninguna')
    throw new Error('--politica must be facturae, age or ninguna')
  return policy
}
