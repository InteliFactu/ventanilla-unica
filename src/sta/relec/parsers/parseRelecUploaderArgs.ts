import { unescapeHtml } from '../../../html/unescapeHtml'

/** The signed uploader arguments belonging to one holder-specific catalogue row. */
export const parseRelecUploaderArgs = (
  html: string,
  slot: string,
  person: string,
): readonly string[] => {
  const args = [...unescapeHtml(html).matchAll(/openUploader\(([^)]+)\)/g)]
    .map((call) =>
      [...(call[1] ?? '').matchAll(/'([^']*)'/g)].map((arg) => arg[1] ?? ''),
    )
    .find((values) => values[0] === slot && values[3] === person)
  if (args === undefined || args.length !== 9 || args[2] !== 'S')
    throw new Error(
      `slot ${slot} has no signed uploader for the certificate holder`,
    )
  if (!args[1]?.split(',').includes('pdf'))
    throw new Error(`slot ${slot} does not accept PDFs`)
  return args
}
