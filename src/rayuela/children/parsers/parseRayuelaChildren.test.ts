import { expect, it } from 'vitest'
import { parseRayuelaChildren } from './parseRayuelaChildren'

it('parseRayuelaChildren reads synthetic portal markup and rejects unsupported input', () => {
  const card = `<TABLE id="CONT"><td>Nombre:&nbsp;<font class="columnaValor">Dana Example</font></td><td>Fecha de nacimiento:&nbsp;<font class="columnaValor">01/01/2015</font></td><td>NIA:&nbsp;<font class="columnaValor">1000001</font></td><td>Tutores legales:<br>&nbsp;<font class="columnaValor">Alex Example<br>Pat Example</font></td><td>Centros:<br>&nbsp;<font class="columnaValor">Example School<br>&nbsp;5º Primary (B)<br>&nbsp;Tutor: Taylor Example<br><br></font></td><div class='tLogin'>dana.example</div></TABLE>`
  expect(parseRayuelaChildren(card + card)).toHaveLength(2)
  expect(parseRayuelaChildren(card)[0]).toEqual({
    name: 'Dana Example',
    birthDate: '01/01/2015',
    nia: '1000001',
    school: 'Example School',
    course: '5º Primary',
    group: 'B',
    tutor: 'Taylor Example',
    pupilLogin: 'dana.example',
    legalGuardians: ['Alex Example', 'Pat Example'],
  })
  expect(() => parseRayuelaChildren('')).toThrow('not found')
})
