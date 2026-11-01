import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'

/** A synthetic visible text field value, with the given properties overridden. */
export const dgsfpFieldValueFixture = (
  patch: Partial<DgsfpFieldValue>,
): DgsfpFieldValue => ({
  nombre: 'n',
  etiqueta: 'e',
  tipo: 'DatosControlTexto',
  key: '',
  value: '',
  visible: true,
  deshabilitado: false,
  ocultarInformeFinal: false,
  ...patch,
})
