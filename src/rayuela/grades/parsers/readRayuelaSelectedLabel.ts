import { readRayuelaOptions } from './readRayuelaOptions'
/** The label the portal shows for a select; empty when nothing is selected. */
export const readRayuelaSelectedLabel = (html: string, name: string): string =>
  readRayuelaOptions(html, name).find((option) => option.selected)?.label ?? ''
