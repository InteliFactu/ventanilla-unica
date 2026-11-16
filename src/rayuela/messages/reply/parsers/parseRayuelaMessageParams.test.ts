import { expect, it } from 'vitest'
import { parseRayuelaMessageParams } from './parseRayuelaMessageParams'

const html =
  '<INPUT TYPE="HIDDEN" NAME=OpEmergente1 VALUE="X_IDENTIFICADOR=11&BANDEJA=REC&X_MENUSU=21">' +
  '<INPUT TYPE="HIDDEN" NAME=OpEmergente2 VALUE="X_IDENTIFICADOR=12&amp;BANDEJA=REC&amp;X_MENUSU=22">'
it('finds the row of the message by its id', () => {
  expect(parseRayuelaMessageParams(html, '12')).toMatchObject({
    X_IDENTIFICADOR: '12',
    X_MENUSU: '22',
  })
})
it('refuses a message that is not on the page', () => {
  expect(() => parseRayuelaMessageParams(html, '99')).toThrow(
    'nothing was sent',
  )
})
