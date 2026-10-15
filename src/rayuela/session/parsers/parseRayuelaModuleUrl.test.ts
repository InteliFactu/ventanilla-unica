import { expect, it } from 'vitest'
import { parseRayuelaModuleUrl } from './parseRayuelaModuleUrl'

it('parseRayuelaModuleUrl reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    parseRayuelaModuleUrl(
      "<input value='https://rayuela.educarex.es/segedu/jsp/EntradaDirectaUsuario.jsp?token=fake&amp;x=1'>",
    ),
  ).toContain('token=fake&x=1')
  expect(() => parseRayuelaModuleUrl('<form></form>')).toThrow(
    'entry was not found',
  )
})
