import type { JusticiaExpediente } from '../types/JusticiaExpediente'
import { readCardFields } from './readCardFields'

/** The expediente cards of the "Mis expedientes" page, in list order. */
export const parseExpedienteCards = (
  html: string,
): readonly JusticiaExpediente[] =>
  [...html.matchAll(/<a class="cj-card[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].flatMap(
    (match, position): readonly JusticiaExpediente[] => {
      const fields = readCardFields(match[1] ?? '')
      const field = (label: string): string => fields.get(label) ?? ''
      const index = /idExpediente=(\d+)/.exec(match[0])?.[1]
      const procedimiento = fields.get('Procedimiento')
      if (procedimiento === undefined) return []
      return [
        {
          index: index === undefined ? position : Number(index),
          procedimiento,
          organo: field('Órgano'),
          estado: field('Estado'),
          fechaEstado: field('Fecha de estado'),
          provincia: field('Provincia'),
          localidad: field('Localidad'),
          nig: field('NIG'),
        },
      ]
    },
  )
