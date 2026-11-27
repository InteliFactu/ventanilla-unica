import { describe, expect, it } from 'vitest'

import { sexpeDemandCapture } from '../fixtures/sexpeDemandCapture'
import { parseSexpeDemand } from './parseSexpeDemand'

describe('parseSexpeDemand', () => {
  it('reads the administrative status from the observed SNE structure', () => {
    expect(parseSexpeDemand(sexpeDemandCapture)).toEqual({
      status: 'BAJA',
      cause: 'No renovación',
      employmentStatus: 'Sin empleo',
      specialGroup: 'Acuerdo de actividad',
    })
  })

  it('recognizes an explicit active status and empty optional group', () => {
    const html = sexpeDemandCapture
      .replace('BAJA', 'ALTA')
      .replace('Acuerdo de actividad', '')
    expect(parseSexpeDemand(html)).toMatchObject({
      status: 'ALTA',
      specialGroup: null,
    })
  })

  it('rejects a login page or a missing administrative field', () => {
    expect(() =>
      parseSexpeDemand('<title>Consulta de demanda</title>'),
    ).toThrow('administrative status')
    expect(() =>
      parseSexpeDemand(
        sexpeDemandCapture.replace('Colectivo Especial', 'Otro'),
      ),
    ).toThrow('incomplete')
  })

  it('rejects an unknown status or competing administrative fields', () => {
    expect(() =>
      parseSexpeDemand(sexpeDemandCapture.replace('BAJA', 'DESCONOCIDA')),
    ).toThrow('unrecognized demand status')
    expect(() =>
      parseSexpeDemand(
        sexpeDemandCapture.replace(
          'Causa de situaci&oacute;n',
          'Situaci&oacute;n de demanda',
        ),
      ),
    ).toThrow('ambiguous')
  })

  it('ignores an administrative result inside a template', () => {
    const inert = sexpeDemandCapture.replace(
      /<fieldset>\s*<legend><b>Situaci&oacute;n Administrativa<\/b><\/legend>[\s\S]*?<\/fieldset>/,
      '<template>$&</template>',
    )
    expect(() => parseSexpeDemand(inert)).toThrow('administrative status')
  })
})
