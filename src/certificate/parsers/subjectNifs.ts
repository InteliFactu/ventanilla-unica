/**
 * The NIFs a certificate subject names: the holder's (`serialNumber=IDCES-…`)
 * and, on a representative's certificate, the represented entity's
 * (`organizationIdentifier=VATES-…`).
 */
export const subjectNifs = (subject: string): string[] =>
  [
    ...subject.matchAll(
      /(?:serialNumber=IDCES-|organizationIdentifier=VATES-)([0-9A-Z]{9})/g,
    ),
  ].map((match) => match[1] ?? '')
