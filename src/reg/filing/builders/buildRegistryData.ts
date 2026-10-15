import type { RegUser } from '../../session/types/RegUser'
import type { PreparedRegFiling } from '../types/PreparedRegFiling'
import type { RegAttachment } from '../types/RegAttachment'
import type { RegFilingQuery } from '../types/RegFilingQuery'

/**
 * The entry the front's `preparePayload` builds for a holder acting in their
 * own name (`isRepresentative` false), addressed to one DIR3 unit, with the
 * uploaded attachments; `consent` is the step 4 checkbox. Country 724 (Spain).
 */
export const buildRegistryData = (
  holder: RegUser,
  query: RegFilingQuery,
  prepared: Pick<PreparedRegFiling, 'organism' | 'address'>,
  attachments: readonly RegAttachment[],
): string =>
  JSON.stringify({
    isRepresentative: false,
    interesteds: [
      {
        cdInteresteds: 0,
        docType: holder.docType,
        docNumber: holder.docNumber,
        name: holder.nameUser,
        fSurname: holder.firstSurname,
        sSurname: holder.familyNameUser
          .slice(holder.firstSurname.length)
          .trim(),
        bussinesName: holder.businessName ?? '',
        streetType: prepared.address.viaType.code,
        streetName: prepared.address.via,
        streetBlock: '',
        blockStair: '',
        blockFloor: '',
        blockDoor: '',
        zipCode: prepared.address.zipCode,
        phone: query.phone,
        country: '724',
        province: prepared.address.province.code,
        city: prepared.address.town.code,
        email: query.email,
      },
    ],
    requestData: {
      targetOrganism: prepared.organism.cdUtOrganic,
      subject: query.subject,
      expose: query.exposes,
      request: query.request,
      alertSMS: false,
      alertMAIL: query.email !== '',
      consent: true,
    },
    attachments,
  })
