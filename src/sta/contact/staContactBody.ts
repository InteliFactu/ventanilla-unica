import type { StaContactQuery } from './types/StaContactQuery'
import type { StaGateButton } from './types/StaGateButton'

/**
 * The urlencoded fields a button of `CONFIRMACION_DATOS_PERSONALES` sends to
 * `submitAjax.aa` (captured on sede.caceres.es 2026-10-09). Only "Guardar"
 * (`PERSCONTACT_ADD`) carries the phone and e-mail.
 */
export const staContactBody = (
  button: StaGateButton,
  query: StaContactQuery,
): Readonly<Record<string, string>> => ({
  aaxmlrequest: 'true',
  eventScreenId: button.screenId,
  eventComponent: '',
  eventObject: button.object,
  eventAction: button.action,
  eventArguments: '',
  PAGE_CODE: 'CONFIRMACION_DATOS_PERSONALES',
  APP_CODE: 'STA',
  PAGE_COMPLETE: '',
  ROOTID: '3',
  HFC: 'HEADER#FOOTER',
  SESSION_REQUIRED: 'false',
  ...(button.action === 'PERSCONTACT_ADD'
    ? { phone: query.phone, mail: query.email }
    : {}),
})
