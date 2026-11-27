import { readAttribute } from '../../../html/readAttribute'

/** Recognize common HTML and stylesheet markers for a nonvisible element. */
export const isHiddenAppointmentElement = (tag: string): boolean => {
  const classes = readAttribute(tag, 'class') ?? ''
  const style = readAttribute(tag, 'style') ?? ''
  return (
    /\s(?:hidden(?=[\s=>])|aria-hidden\s*=\s*['"]?true(?=['"\s>]))/i.test(
      tag,
    ) ||
    /(?:^|\s)(?:d-none|invisible)(?=\s|$)/.test(classes) ||
    /(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/i.test(style)
  )
}
