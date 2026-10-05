import type { DgsfpControl } from '../types/DgsfpControl'
import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import type { DgsfpHolder } from '../types/DgsfpHolder'
import { mountedValue } from './mountedValue'

/**
 * A control's value right after the page loads: `InicializarValoresContext`
 * copies the definition (a hidden text control is left out of the report),
 * then each control's `componentDidMount` may set a default.
 */
export const initialFieldValue = (
  control: DgsfpControl,
  holder: DgsfpHolder,
): DgsfpFieldValue => {
  const base: DgsfpFieldValue = {
    nombre: control.nombre,
    etiqueta: control.etiqueta ?? '',
    tipo: control.tipo,
    key: '',
    value: '',
    visible: true,
    deshabilitado: control.deshabilitado ?? false,
    ocultarInformeFinal:
      (control.ocultarInformeFinal ?? false) ||
      (control.tipo === 'DatosControlTexto' && control.oculto === true),
    multiple: [],
    tabla: [],
  }
  const mounted = mountedValue(control, holder)
  return mounted === undefined
    ? base
    : { ...base, ...mounted, multiple: undefined, tabla: undefined }
}
