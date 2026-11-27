/** Add a page's warning to the listing's warnings, once per distinct text. */
export const appendWarning = (
  warnings: string[],
  warning: string | null,
): void => {
  if (warning !== null && !warnings.includes(warning)) warnings.push(warning)
}
