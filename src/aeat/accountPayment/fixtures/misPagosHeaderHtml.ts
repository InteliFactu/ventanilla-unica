import { accountPaymentFixture } from './accountPaymentFixture'

/** The personal-area header every MisPagos page prints, even with no payments. */
export const misPagosHeaderHtml = `<span id="user-name" class="aeat--username">${accountPaymentFixture.nombre}</span>`
