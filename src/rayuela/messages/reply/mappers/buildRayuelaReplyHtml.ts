/** The editor stores paragraphs as `<p>`; line breaks inside one become `<br>`. */
export const buildRayuelaReplyHtml = (text: string): string =>
  text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => {
      const escaped = paragraph
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('\n', '<br>')
      return `<p>${escaped}</p>`
    })
    .join('\n')
