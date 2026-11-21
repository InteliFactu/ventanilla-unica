import { presentationBaseUrl } from '../presentationBaseUrl'

/** The census window the AEAT shows before a model's presentation form, where the holder is identified. */
export const censusWindowUrl = (modelo: string): string =>
  `${presentationBaseUrl}/wlpl/TOAE-JDIT/VentanaCensalIva?fOrigen=pre${modelo}`
