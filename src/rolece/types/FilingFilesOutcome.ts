/** The paths written and the failures reported while saving filing files. */
export type FilingFilesOutcome = {
  readonly written: string[]
  readonly failed: string[]
}
