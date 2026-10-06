import { alphaField } from '../mappers/alphaField'
import { numberField } from '../mappers/numberField'
import { zeroField } from '../mappers/zeroField'
import type { Model190Declarant } from '../types/Model190Declarant'
import type { Model190Perceptor } from '../types/Model190Perceptor'

/**
 * The 500-character type 2 record of the 2025 design (DISENOS_LOGICOS_190_2025):
 * dinerarias only, nothing in especie, no incapacidad laboral, no reductions,
 * descendants or foral data. Positions are noted where each group starts.
 */
export const buildPerceptorRecord = (
  declarant: Model190Declarant,
  perceptor: Model190Perceptor,
): string =>
  [
    `2190${declarant.ejercicio}${declarant.nif}`,
    alphaField(perceptor.nif, 9),
    ' '.repeat(9),
    alphaField(perceptor.nombre.slice(0, 40), 40),
    perceptor.provincia,
    `${perceptor.clave}${perceptor.subclave}`,
    // 81: dinerarias (sign, amount, withholding)
    ` ${numberField(perceptor.percepcion, 13)}${numberField(perceptor.retencion, 13)}`,
    // 108: en especie (sign, value, ingreso a cuenta, repercutido)
    ` ${zeroField(39)}`,
    // 148: ejercicio devengo, Ceuta o Melilla
    '00000',
    // 153: birth year, family situation, spouse NIF, disability, contract, unidad, movilidad
    `${perceptor.nacimiento}${perceptor.situacion}${' '.repeat(9)}0${perceptor.contrato}00`,
    // 171: reducciones, gastos deducibles, pensiones, anualidades
    `${zeroField(13)}${numberField(perceptor.gastos, 13)}${zeroField(26)}`,
    // 223: descendants, ascendants, first three children, vivienda
    zeroField(32),
    // 255: incapacidad laboral, dineraria and en especie
    ` ${zeroField(26)} ${zeroField(39)}`,
    // 322: infancia, foral withholding, emergentes, fondos, B.01 types
    `0${zeroField(65)}0000000`,
  ]
    .join('')
    .padEnd(500, ' ')
