/** The notification address's province and municipality, resolved against the sede's lists. */
export type DgsfpPlace = {
  readonly province: { readonly key: string; readonly value: string }
  readonly municipality: { readonly key: string; readonly value: string }
}
