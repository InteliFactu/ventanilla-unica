import { plainUpperText } from '../mappers/plainUpperText'
import type { Model190Perceptor } from '../types/Model190Perceptor'
import { readClave } from '../validators/readClave'
import { readContract } from '../validators/readContract'
import { readDigitsColumn } from '../validators/readDigitsColumn'
import { readFamilySituation } from '../validators/readFamilySituation'
import { readNifColumn } from '../validators/readNifColumn'
import { readSubclave } from '../validators/readSubclave'
import { requireColumn } from '../validators/requireColumn'
import { parseAmountCents } from './parseAmountCents'

/** One CSV row -> one perceptor; the A-only data is required under A and zeroed under L. */
export const parsePerceptorRow = (
  row: Readonly<Record<string, string>>,
): Model190Perceptor => {
  const clave = readClave(row['clave'])
  const underA = clave === 'A'
  return {
    nif: readNifColumn(row, 'nif'),
    nombre: plainUpperText(requireColumn(row, 'nombre')),
    provincia: readDigitsColumn(row, 'provincia', 2),
    clave,
    subclave: readSubclave(clave, row['subclave']),
    percepcion: parseAmountCents(row['percepcion'] ?? '', 'percepcion'),
    retencion: parseAmountCents(row['retencion'] ?? '', 'retencion'),
    gastos: parseAmountCents(row['gastos'] ?? '', 'gastos'),
    nacimiento: underA ? readDigitsColumn(row, 'nacimiento', 4) : '0000',
    situacion: underA ? readFamilySituation(row['situacion']) : '0',
    contrato: underA ? readContract(row) : '0',
  }
}
