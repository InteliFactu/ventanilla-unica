import type { RegistrySchema } from '../types/RegistrySchema'

/**
 * The `data` block: one entry per schema element that has a value, each
 * value tagged with its field id and type, as the SPA serialises it.
 */
export const buildRegistryData = (
  schema: RegistrySchema,
  values: Readonly<Record<string, string>>,
): readonly Readonly<Record<string, unknown>>[] =>
  schema.sections.data.elements
    .map((element) => ({
      id: element.id,
      name: '',
      type: 'var',
      parent: null,
      idControl: null,
      values: element.fields
        .filter((field) => values[field.id] !== undefined)
        .map((field) => ({
          field: { id: field.id, name: field.id, type: field.type ?? 'text' },
          value: values[field.id],
        })),
    }))
    .filter((entry) => entry.values.length > 0)
