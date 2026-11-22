import { draftAppPath } from './draftAppPath'

/** The ZK update endpoint of one model's form on a host: the open simulator (www2) or the presentation form (www1). */
export const draftZkauUrl = (baseUrl: string, modelo: string): string =>
  `${baseUrl}${draftAppPath(modelo)}/pwda/zkau`
