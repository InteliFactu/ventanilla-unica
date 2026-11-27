import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'
import { fetchAgreements } from './fetchAgreements'

const agreement = '100000000001A'
const debt = 'A1000000000000001'
const detailUrl = `${aeatBaseUrl}/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=${agreement}`
const calendarUrl = `${aeatBaseUrl}/wlpl/inwinvoc/es.aeat.dit.adu.sraf.vtosaplaz.VtapAccDeta?fAccion=consIntPlazos&solicitud=100000000000001&acuerdo=${agreement}&kliq=Z1000000000000000001&numordvto=1`
const calendarLink = `<a href="${calendarUrl.replaceAll('&', '&amp;')}">Consultar plazos</a>`
const agreementDetail = `<p>Acuerdo: ${agreement} (Acuerdo notificado)</p><p>Deuda: ${debt}</p>`
const header = `<tr><th>Deudas</th><th>Num.Plazo</th><th>Fase</th><th>Fecha límite ingreso</th><th>Importe pendiente</th><th>Intereses precal.</th><th>Importe total</th></tr>`
const first = `<tr><td>${debt}</td><td>1</td><td>Voluntaria</td><td>05-02-2026</td><td>100,00</td><td>1,14</td><td>101,14</td></tr>`
const paid = first
  .replace('100,00', '0,00')
  .replace('1,14', '0,00')
  .replace('101,14', '0,00')
const second = first
  .replace('<td>1</td>', '<td>2</td>')
  .replace('05-02-2026', '05-03-2026')

describe('AEAT agreement calendar', () => {
  it('reads the linked current calendar and keeps the last version of a repeated instalment', async () => {
    const client = scriptedClient(
      htmlResponse(aeatBaseUrl, `<a href="${detailUrl}">${agreement}</a>`),
      htmlResponse(
        detailUrl,
        `${agreementDetail}${calendarLink}<a href="#" onclick="Ventana('${calendarUrl}');return false;">Consultar plazos</a>`,
      ),
      htmlResponse(
        calendarUrl,
        `<table>${header}${first}${paid}${second}</table>`,
      ),
    )
    const [result] = await fetchAgreements(client)
    expect(result).toMatchObject({
      acuerdo: agreement,
      currentInstalments: [
        {
          debtKey: debt,
          number: 1,
          phase: 'Voluntaria',
          dueDate: '2026-02-05',
          total: { text: '0,00', amount: 0 },
          paid: true,
        },
        {
          debtKey: debt,
          number: 2,
          phase: 'Voluntaria',
          dueDate: '2026-03-05',
          pending: { text: '100,00', amount: 100 },
          interest: { text: '1,14', amount: 1.14 },
          total: { text: '101,14', amount: 101.14 },
          paid: false,
        },
      ],
    })
    expect(client.request.mock.calls).toHaveLength(3)
    expect(client.request.mock.calls.at(-1)).toEqual([
      calendarUrl,
      {
        defaultCharset: 'iso-8859-15',
        followRedirects: false,
      },
    ])
  })

  it.each([
    [
      'unrelated table',
      '<table><tr><td>Deuda</td><td>Solicitud</td></tr></table>',
    ],
    [
      'invalid due date',
      `<table>${header}${first.replace('05-02-2026', '30-02-2026')}</table>`,
    ],
    ['inactive ancestor', `<div hidden><table>${header}${first}</table></div>`],
    [
      'invisible table',
      `<table style="display: none">${header}${first}</table>`,
    ],
    [
      'wrong debt key',
      `<table>${header}${first.replace(debt, 'A1000000000000099')}</table>`,
    ],
    [
      'inconsistent zero total',
      `<table>${header}${first.replace('101,14', '0,00')}</table>`,
    ],
  ])(
    'does not report %s as a calendar with zero or fewer instalments',
    async (_case, html) => {
      const client = scriptedClient(
        htmlResponse(aeatBaseUrl, `<a href="${detailUrl}">${agreement}</a>`),
        htmlResponse(detailUrl, `${agreementDetail}${calendarLink}`),
        htmlResponse(calendarUrl, html),
      )
      const [result] = await fetchAgreements(client)
      expect(result).toMatchObject({
        acuerdo: agreement,
        currentInstalmentsNote:
          'AEAT: the current instalment calendar could not be verified',
      })
      expect(result?.currentInstalments).toBeUndefined()
    },
  )

  it('uses only active links for the same authority, agreement and read action', async () => {
    const detail = [
      calendarLink.replace(aeatBaseUrl, 'https://other.example.invalid'),
      calendarLink.replace(agreement, '100000000099A'),
      calendarLink.replace('consIntPlazos', 'otherAction'),
      `<!-- ${calendarLink} -->`,
      `<template>${calendarLink}</template>`,
      `<p>"${calendarUrl}"</p>`,
      `<a data-target="${calendarUrl}">Consultar</a>`,
      `<div inert>${calendarLink}</div>`,
    ].join('')
    const client = scriptedClient(
      htmlResponse(aeatBaseUrl, `<a href="${detailUrl}">${agreement}</a>`),
      htmlResponse(detailUrl, `${agreementDetail}${detail}`),
    )
    const [result] = await fetchAgreements(client)
    expect(result?.currentInstalments).toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(2)
  })

  it('does not trust calendar rows without an advertised debt on the agreement', async () => {
    const client = scriptedClient(
      htmlResponse(aeatBaseUrl, `<a href="${detailUrl}">${agreement}</a>`),
      htmlResponse(detailUrl, calendarLink),
    )
    const [result] = await fetchAgreements(client)
    expect(result?.currentInstalmentsNote).toBeDefined()
    expect(client.request.mock.calls).toHaveLength(2)
  })
})
