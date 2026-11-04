import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import { youthGuaranteeAnswers } from './youthGuaranteeAnswers'

export const youthGuaranteeContactAnswers: YouthGuaranteeAnswers = {
  ...youthGuaranteeAnswers,
  '2': {
    choice: 'A',
    'datosContacto.movilC': '600000000',
    'datosContacto.correoElectronicoC': 'holder@example.test',
    'datosContacto.correoElectronicoCR': 'holder@example.test',
    'datosDireccionDomicilio.tcodProvincia': '10',
    'datosDireccionDomicilio.tcodMunicipio': 'CACERES',
  },
}
