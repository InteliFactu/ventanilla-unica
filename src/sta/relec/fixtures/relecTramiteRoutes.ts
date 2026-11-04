import { respondWith } from '../../registry/fixtures/respondWith'
import { relecRoutes } from './relecRoutes'
import { relecTramiteFormHtml } from './relecTramiteFormHtml'

/** Synthetic catalogue form followed by the shared Relec submission responses. */
export const relecTramiteRoutes: typeof relecRoutes = [
  [
    (url) => url.includes('/Relec/TramitaForm'),
    (url) => respondWith(url, relecTramiteFormHtml),
  ],
  ...relecRoutes,
]
