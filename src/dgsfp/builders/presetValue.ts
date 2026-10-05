import type { DgsfpControl } from '../types/DgsfpControl'

/** The `ValorPredeterminado` a text or number control writes on mount: only a truthy one, as a string. */
export const presetValue = (control: DgsfpControl): string | undefined => {
  const preset = control.ValorPredeterminado
  const writesPreset =
    control.tipo === 'DatosControlTexto' ||
    control.tipo === 'DatosControlNumerico'
  const truthy =
    (typeof preset === 'string' && preset !== '') ||
    (typeof preset === 'number' && preset !== 0)
  return writesPreset && truthy ? String(preset) : undefined
}
