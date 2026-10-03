/**
 * Whether the certificate text is POSITIVO (true) or NEGATIVO (false). The
 * certificate states it in one sentence ("tiene carácter de POSITIVO",
 * older ones "tiene carácter POSITIVO"); a bare NEGATIVO anywhere wins over
 * a bare POSITIVO when that sentence is missing. Undefined when neither word
 * is in the text.
 */
export const parseComplianceSign = (text: string): boolean | undefined => {
  const stated = /car[aá]cter\s+(?:de\s+)?(POSITIVO|NEGATIVO)/i.exec(text)?.[1]
  if (stated !== undefined) return stated.toUpperCase() === 'POSITIVO'
  if (/\bNEGATIVO\b/i.test(text)) return false
  if (/\bPOSITIVO\b/i.test(text)) return true
  return undefined
}
