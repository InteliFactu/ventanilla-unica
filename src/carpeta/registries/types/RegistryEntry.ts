import type { RegistryAnnotation } from './RegistryAnnotation'
import type { RegistryParty } from './RegistryParty'

/** One entry ("asiento") of the general registry, as Escritos y solicitudes lists it. */
export type RegistryEntry = {
  /** `numRegistro`, such as `REGAGE26e00000000001`. */
  readonly number: string
  /** `fechaRegistro` exactly as the Carpeta sends it. */
  readonly registeredAt: string | null
  /** `dsOficinaRegistroInicio`, the office that registered it. */
  readonly office: string | null
  /** `cdIntercambio`, the SIR exchange code the front's detail page is keyed by. */
  readonly exchangeCode: string | null
  /** The description of the most recent annotation, or null when there is none. */
  readonly state: string | null
  readonly annotations: readonly RegistryAnnotation[]
  readonly parties: readonly RegistryParty[]
}
