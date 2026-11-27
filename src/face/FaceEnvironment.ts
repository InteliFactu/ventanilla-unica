import type { faceSoapUris } from './faceSoapUris'

/** FACe environments with a supplier SOAP v1 binding. */
export type FaceEnvironment = keyof typeof faceSoapUris.supplier
