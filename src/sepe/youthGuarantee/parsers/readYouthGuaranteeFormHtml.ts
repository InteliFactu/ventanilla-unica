import { readAttribute } from '../../../html/readAttribute'

/** The wizard form is nested in contSol; select its opening tag explicitly. */
export const readYouthGuaranteeFormHtml = (
  html: string,
  step?: number,
): string => {
  const clean = html.replaceAll(/<!--[\s\S]*?-->/g, '')
  const opening = [...clean.matchAll(/<form\b[^>]*>/gi)].find(([tag]) => {
    const name = readAttribute(tag, 'name') ?? ''
    return step === undefined
      ? /^solicitudPaso[1-6]$/.test(name)
      : name === `solicitudPaso${String(step)}`
  })
  const block = opening
    ? clean.slice(opening.index).match(/^[\s\S]*?<\/form>/i)?.[0]
    : undefined
  if (!block)
    throw new Error(
      `Garantía Juvenil: missing inscription page ${String(step ?? '')}`,
    )
  return block
}
