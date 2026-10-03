import type { RegistryDataElement } from './RegistryDataElement'
import type { RegistryDocumentElement } from './RegistryDocumentElement'

/** The part of `GET /requests/<procedure>/<reference>` this client relies on. */
export type RegistrySchema = {
  readonly sections: {
    readonly data: { readonly elements: readonly RegistryDataElement[] }
    readonly documents: {
      readonly elements: readonly RegistryDocumentElement[]
    }
  }
}
