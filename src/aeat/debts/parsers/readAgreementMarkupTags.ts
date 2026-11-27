/** Tokenize whole tags so markup-looking text inside a quoted attribute stays inert. */
export const readAgreementMarkupTags = (
  html: string,
): Iterable<RegExpExecArray> =>
  html.matchAll(
    /<(\/?)([a-z][\w:-]*)(?=[\s/>])((?:"[^"]*"|'[^']*'|[^"'<>])*)>/gi,
  )
