import type { HttpResponse } from '../../../http/types/HttpResponse'

/**
 * The JSON object a sede JSP answers. The gateway in front of it answers a
 * refused request with a SOAP fault instead ("Rejected by policy"), which is
 * reported with its status rather than as a JSON syntax error.
 */
export const readDgtJson = (
  response: HttpResponse,
  service: string,
): Record<string, unknown> => {
  try {
    const value: unknown = JSON.parse(response.text)
    if (typeof value === 'object' && value !== null && !Array.isArray(value))
      return value as Record<string, unknown>
  } catch {
    // Falls through to the error below, with the body that was not JSON.
  }
  const fault = /<faultstring>([^<]*)<\/faultstring>/.exec(response.text)?.[1]
  throw new Error(
    `DGT ${service}: ${String(response.status)} ${fault ?? response.text.slice(0, 120)}`,
  )
}
