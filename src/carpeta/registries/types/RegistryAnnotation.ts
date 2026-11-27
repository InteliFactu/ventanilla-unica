/** One state annotation of a registry entry, as the Carpeta Ciudadana reports it. */
export type RegistryAnnotation = {
  /** `cdEstado`, the SIR state code (`02`, `09`, `03`...). */
  readonly code: string | null
  readonly description: string | null
  /** `fechaAnotacion` exactly as the Carpeta sends it. */
  readonly at: string | null
  readonly observations: string | null
  /** `dsOrOrigen`, which the front labels "Oficina de destino". */
  readonly office: string | null
}
