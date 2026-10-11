import { readText } from '../parsers/readText'
import type { DgtAddress } from '../types/DgtAddress'

/** The ATEX `domicilioCompleto` object as a typed address with a one-line rendering. */
export const mapAtexAddress = (value: unknown): DgtAddress => {
  const field = (key: string): string => readText(value, key)
  const parts = [
    `${field('tipoVia')} ${field('via')}`.trim(),
    field('numeroVia'),
    field('planta') && `planta ${field('planta')}`,
    field('puerta') && `puerta ${field('puerta')}`,
    field('escalera') && `escalera ${field('escalera')}`,
    `${field('cp')} ${field('municipio')}`.trim(),
    field('provincia') && `(${field('provincia')})`,
  ]
  return {
    tipoVia: field('tipoVia'),
    via: field('via'),
    numero: field('numeroVia'),
    planta: field('planta'),
    puerta: field('puerta'),
    escalera: field('escalera'),
    cp: field('cp'),
    municipio: field('municipio'),
    provincia: field('provincia'),
    texto: parts.filter(Boolean).join(', '),
  }
}
