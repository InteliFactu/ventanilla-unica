import type { AccountPaymentPages } from './AccountPaymentPages'
import { accountPaymentFixture } from './accountPaymentFixture'
import { accountPaymentFormHtml } from './accountPaymentFormHtml'
import { collaboratingEntitiesHtml } from './collaboratingEntitiesHtml'
import { misPagosHistoryHtml } from './misPagosHistoryHtml'

/** The page the synthetic portal answers to a GET of `url`. */
export const accountPaymentPortalPage = (
  url: string,
  pages: AccountPaymentPages,
): string => {
  const routes: readonly (readonly [string, string])[] = [
    ['VerEntidadesAdheridas', collaboratingEntitiesHtml],
    ['MisPagos', pages.paymentsHtml ?? misPagosHistoryHtml(pages.payments)],
    ['ImpresionPDF', pages.pdf ?? '%PDF-1.4'],
    [
      'LiquidacionesCuenta',
      (pages.blank ?? accountPaymentFormHtml).replace(
        accountPaymentFixture.nif,
        pages.certificateNif ?? accountPaymentFixture.nif,
      ),
    ],
  ]
  return routes.find(([fragment]) => url.includes(fragment))?.[1] ?? 'session'
}
