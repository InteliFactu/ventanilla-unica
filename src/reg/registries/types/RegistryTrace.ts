/** `trace/:registryNumber/1/false`: the SIR exchange annotations (sent, confirmed, ...). */
export type RegistryTrace = {
  readonly annotations: readonly {
    readonly annotationDate: string
    readonly dsState: string
    readonly dsOrDestination: string
    readonly observations: string | null
  }[]
}
