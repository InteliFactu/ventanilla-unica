/** Markup in comments, raw-text elements or templates is not payment history. */
export const stripInertPaymentMarkup = (html: string): string => {
  const text = html.replaceAll(
    /<!--[\s\S]*?(?:-->|$)|<(script|style|textarea|title)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi,
    ' ',
  )
  const output: string[] = []
  let templateDepth = 0
  for (const fragment of text.split(/(<\/?template\b[^>]*>)/i)) {
    if (/^<template\b/i.test(fragment)) {
      templateDepth += 1
    } else if (/^<\/template\s*>$/i.test(fragment)) {
      templateDepth = Math.max(0, templateDepth - 1)
    } else if (templateDepth === 0) {
      output.push(fragment)
    }
  }
  return output.join(' ')
}
