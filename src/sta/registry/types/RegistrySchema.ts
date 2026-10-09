import type { RegistryDataElement } from './RegistryDataElement'
import type { RegistryDocumentElement } from './RegistryDocumentElement'

/**
 * The part of `GET /requests/<procedure>/<reference>` this client relies on.
 * The contribution procedure ("APORDOC") declares no documents section, only
 * the one document type contributions are stored as, `apordocType`.
 */
export type RegistrySchema = {
  readonly sections: {
    readonly data: { readonly elements: readonly RegistryDataElement[] }
    readonly documents: {
      readonly elements: readonly RegistryDocumentElement[]
    } | null
  }
  readonly apordocType?: { readonly id: string } | null | undefined
}
