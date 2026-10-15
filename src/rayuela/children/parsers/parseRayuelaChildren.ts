import { mapRayuelaChild } from '../mappers/mapRayuelaChild'
import type { RayuelaChild } from '../types/RayuelaChild'
/** Each pupil starts a new CONT layout table; never follow credential controls. */
export const parseRayuelaChildren = (html: string): RayuelaChild[] => {
  const blocks = html.split(/<table\s[^>]*id=["']CONT["'][^>]*>/i).slice(1)
  if (blocks.length === 0) throw new Error('Rayuela children were not found')
  return blocks.map(mapRayuelaChild)
}
