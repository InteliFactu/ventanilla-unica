import type { RayuelaTeacher } from './RayuelaTeacher'

export type RayuelaTeachers = {
  readonly group: string
  readonly tutor: string
  readonly teachers: readonly RayuelaTeacher[]
}
