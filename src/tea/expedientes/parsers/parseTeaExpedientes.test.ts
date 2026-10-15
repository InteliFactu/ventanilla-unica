import { describe, expect, it } from 'vitest'

import { parseTeaExpedientes } from './parseTeaExpedientes'

const holder =
  '<li><strong class="azul">Persona consultada:</strong> <span class="notraducir"><span class="negrita">00000000T - ESPAÑOL ESPAÑOL JUAN</span></span></li>'

describe('parseTeaExpedientes', () => {
  it('reads an empty case list', () => {
    const html = `${holder}<ul><li><span class='raquo'></span>No existen expedientes que mostrar</li></ul>`
    expect(parseTeaExpedientes(html, '00000000T').hasExpedientes).toBe(false)
  })

  it('refuses a list that shows cases', () => {
    expect(() =>
      parseTeaExpedientes(
        `${holder}<table><tr><td>00/00000/2026</td></tr></table>`,
        '00000000T',
      ),
    ).toThrow(/lists cases/)
  })

  it('refuses a page for another holder', () => {
    expect(() =>
      parseTeaExpedientes(
        `${holder}No existen expedientes que mostrar`,
        '11111111H',
      ),
    ).toThrow(/not showing holder 11111111H/)
  })

  it('reports a holder the sede does not authorise', () => {
    expect(() =>
      parseTeaExpedientes(
        '<h3> Descripción: Contribuyente no autorizado. Por favor, acuda a su oficina de la Agencia Tributaria.</h3>',
        'A00000000',
      ),
    ).toThrow(/Contribuyente no autorizado/)
  })
})
