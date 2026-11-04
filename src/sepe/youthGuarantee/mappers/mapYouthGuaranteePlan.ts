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
    'Declare no educational or training activity on the preceding calendar day, Spanish residence registration, truthful data and active participation.',
    `Declared answers: ${JSON.stringify(answers)}`,
  ],
  notes: [
    'Without --confirmar si only login and GET reads run; no answers are saved or remotely validated.',
    'The write protocol has not been executed live. Dependent selections, contact verification or a further signature may require portal interaction; only an explicit registry number proves registration.',
    'Do not retry an ambiguous submission; inspect the portal first.',
  ],
})
