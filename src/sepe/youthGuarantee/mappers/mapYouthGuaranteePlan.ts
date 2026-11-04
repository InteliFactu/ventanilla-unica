import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteeResult } from '../types/YouthGuaranteeResult'
import type { YouthGuaranteeWriteResult } from '../types/YouthGuaranteeWriteResult'

export const mapYouthGuaranteePlan = (
  current: YouthGuaranteeResult,
  answers: YouthGuaranteeAnswers,
): YouthGuaranteeWriteResult => ({
  action: 'sepe garantia-juvenil --inscribir si',
  executed: false,
  current,
  plan: [
    'Submit a Sistema Nacional de Garantía Juvenil inscription request for the authenticated holder.',
    'Save the six wizard steps using the explicitly declared --respuestas; confirm the request on step 6.',
    'Resolve step-2 municipality names within the declared provinces; request SMS and email verification for unverified contacts and wait for --pin-fichero and --enlace-fichero.',
    'Declare no educational or training activity on the preceding calendar day, Spanish residence registration, truthful data and active participation.',
    `Declared answers: ${JSON.stringify(answers)}`,
  ],
  notes: [
    'Without --confirmar si only login and GET reads run; no answers are saved or remotely validated.',
    'The write protocol has synthetic tests only. Confirmed writes require separate --pin-fichero and --enlace-fichero paths; each wait polls every 5 seconds for up to 30 minutes. A further signature may require portal interaction; only an explicit registry number proves registration.',
    'Do not retry an ambiguous submission; inspect the portal first.',
  ],
})
