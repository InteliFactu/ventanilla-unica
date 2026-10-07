/** What `dehu comparecer` was asked to do: which pending notifications, whether for real, and where to save their files. */
export type AppearanceRequest = {
  readonly ids: readonly string[]
  readonly confirm: boolean
  readonly outDir?: string | undefined
}
