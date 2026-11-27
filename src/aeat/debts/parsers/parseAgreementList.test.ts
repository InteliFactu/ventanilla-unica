import { describe, expect, it } from 'vitest'

import { parseAgreementList } from './parseAgreementList'

const baseUrl = 'https://www1.agenciatributaria.gob.es'
const detailPath = '/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta'

const listingFixture = `
<table class='celdasConBorde ancho_98' id='TablaSolicitudes'>
<thead><tr><th>SOLICITUD</th><th>ESTADO</th></tr></thead>
<tbody>
<tr>
<td class='texto_cen'><span class='notraducir'><a href='/wlpl/inwinvoc/es.aeat.dit.adu.sraf.solicitud.SolAccDeta?fAccion=deta&amp;csolicitud=102014000007401&amp;fFigura=obli'>102014000007401</a><br/></span></td>
<td class='texto_cen' > <strong class='azul'>&nbsp;&nbsp;</strong><a class='ventanaNueva' onclick="Ventana('/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&amp;cacuerdo=101440306486W&amp;fFigura=obli');return false;" onkeypress='' href='/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&amp;cacuerdo=101440306486W&amp;fFigura=obli'><span class='notraducir'><strong>101440306486W</strong></span></a></td>
</tr>
<tr>
<td class='texto_cen'><span class='notraducir'><a href='/wlpl/inwinvoc/es.aeat.dit.adu.sraf.solicitud.SolAccDeta?fAccion=deta&amp;csolicitud=102015000000448&amp;fFigura=obli'>102015000000448</a><br/></span></td>
<td class='texto_cen' > <strong class='azul'>&nbsp;&nbsp;</strong><a class='ventanaNueva' onclick="Ventana('/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&amp;cacuerdo=101540300316K&amp;fFigura=obli');return false;" onkeypress='' href='/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&amp;cacuerdo=101540300316K&amp;fFigura=obli'><span class='notraducir'><strong>101540300316K</strong></span></a></td>
</tr>
</tbody>
</table>
`

describe('parseAgreementList', () => {
  it('extracts every cacuerdo code and resolves its detail URL', () => {
    const listings = parseAgreementList(listingFixture, baseUrl)
    expect(listings).toEqual([
      {
        acuerdo: '101440306486W',
        detailUrl:
          'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=101440306486W&fFigura=obli',
      },
      {
        acuerdo: '101540300316K',
        detailUrl:
          'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=101540300316K&fFigura=obli',
      },
    ])
  })

  it('deduplicates a code linked twice from the same row', () => {
    const html = `
      <a href='${detailPath}?fAccion=deta&amp;cacuerdo=100000000001A&amp;fFigura=obli'>100000000001A</a>
      <a href='${detailPath}?fAccion=deta&amp;cacuerdo=100000000001A&amp;fFigura=obli'>100000000001A</a>
    `
    expect(parseAgreementList(html, baseUrl)).toHaveLength(1)
  })

  it('returns nothing for a page with no agreement links', () => {
    expect(parseAgreementList('<a href="/other">x</a>', baseUrl)).toEqual([])
  })

  it.each([
    `https://example.invalid${detailPath}?fAccion=deta&cacuerdo=100000000001A`,
    `http://www1.agenciatributaria.gob.es${detailPath}?fAccion=deta&cacuerdo=100000000001A`,
    `/x/AcuAccDeta?fAccion=deta&cacuerdo=100000000001A`,
    `${detailPath}?fAccion=otro&cacuerdo=100000000001A`,
    `${detailPath}?fAccion=deta&cacuerdo=100000000001A&cacuerdo=100000000002B`,
  ])('rejects an unexpected detail link %s', (href) => {
    expect(
      parseAgreementList(`<a href="${href}">100000000001A</a>`, baseUrl),
    ).toEqual([])
  })
})
