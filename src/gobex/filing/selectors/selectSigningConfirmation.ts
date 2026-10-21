import { readAttribute } from '../../../html/readAttribute'

/** The acceptance button reached by the real MiniApplet success callback, never the simulation panel. */
export const selectSigningConfirmation = (html: string): string => {
  const tag = [...html.matchAll(/<input\b[^>]*>/gi)]
    .map(([item]) => item)
    .find((item) =>
      (readAttribute(item, 'onclick') ?? '').includes(
        "getElementById('f_solicitud:panel_firma')",
      ),
    )
  const name = tag ? readAttribute(tag, 'name') : undefined
  if (!name)
    throw new Error('Junta: no qualified-signature confirmation button')
  return name
}
