import { registradoresUrls } from './registradoresUrls'

/** The absolute URL of a path of the `site` application. */
export const siteUrl = (path: string): string =>
  new URL(path, registradoresUrls.site).href
