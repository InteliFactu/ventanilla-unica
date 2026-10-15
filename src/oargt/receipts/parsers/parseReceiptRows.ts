import { unescapeHtml } from '../../../html/unescapeHtml'
import { euroAmountText } from '../mappers/euroAmountText'
import type { Receipt } from '../types/Receipt'
import type { ReceiptTab } from '../types/ReceiptTab'
import { parseEuroAmount } from './parseEuroAmount'
import { readStringField } from './readStringField'

/**
 * Turn one tab's raw `dataset_DEUDAPENDIENTE` rows into typed receipts. The
 * portal's tax-type name lives in `intypename` (e.g. "IMPUESTO DE BIENES
 * INMUEBLES URBANOS-BICES REC"); `otribdesc` only carries a supplementary
 * detail such as an address or a plate, so both fold into `concept`. `paseje`
 * (the date a receipt passed to ejecutiva) is only present on rows that did,
 * including paid ones, which is what `enforced` reads. Anything that is not a
 * plain object is dropped.
 */
export const parseReceiptRows = (
  rows: readonly unknown[],
  tab: ReceiptTab,
): readonly Receipt[] =>
  rows.flatMap((row): readonly Receipt[] => {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) return []
    const record = row as Readonly<Record<string, unknown>>
    const typeName = readStringField(record, 'intypename')
    // The portal renders an absent detail as "()".
    const rawDetail = readStringField(record, 'otribdesc')
    const detail = rawDetail === '()' ? '' : rawDetail
    const period = readStringField(record, 'periodoVoluntarioReal')
    const paseje = readStringField(record, 'paseje')
    const accountingPeriod = readStringField(record, 'accounyear')
    const number = readStringField(record, 'render_recnumber')
    const principalNumber = parseEuroAmount(record['importePrincipal'])
    const pendingNumber = parseEuroAmount(record['importePendiente'])
    return [
      {
        tab,
        reference: readStringField(record, 'referen'),
        number: number === '' ? undefined : number,
        concept: detail === '' ? typeName : `${typeName} - ${detail}`,
        entity: readStringField(record, 'entityname'),
        principal: euroAmountText(principalNumber),
        pending: euroAmountText(pendingNumber),
        principalNumber,
        pendingNumber,
        situation: readStringField(record, 'render_situacion'),
        directDebit: record['isDomiciliado'] === true,
        enforced: paseje !== '',
        voluntaryPeriod: period === '' ? undefined : unescapeHtml(period),
        accountingPeriod:
          accountingPeriod === '' ? undefined : accountingPeriod,
        paid: record['isCobrado'] === true,
      },
    ]
  })
