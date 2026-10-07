import type { DgsfpControl } from '../types/DgsfpControl'
import type { DgsfpHolder } from '../types/DgsfpHolder'
import type { DgsfpListEntry } from '../types/DgsfpListEntry'
import { holderContextValue } from './holderContextValue'
import { presetValue } from './presetValue'

/**
 * The default a control sets when it mounts, if any: a label shows the
 * holder datum it is bound to; a text or number control its truthy
 * `ValorPredeterminado`; a radio panel selects its first option.
 */
export const mountedValue = (
  control: DgsfpControl,
  holder: DgsfpHolder,
): DgsfpListEntry | undefined => {
  if (control.tipo === 'DatosControlEtiqueta')
    return {
      key: '',
      value: holderContextValue(holder, control.TipoValorContexto ?? '') ?? '',
    }
  const first = control.opciones?.[0]
  if (control.tipo === 'DatosControlRadioButtonPanel' && first)
    return { key: first.idOpcion, value: first.opcion }
  const preset = presetValue(control)
  return preset === undefined ? undefined : { key: '', value: preset }
}
