import type { FakeTgvi } from './FakeTgvi'
import type { TgviFakeAnswer } from './TgviFakeAnswer'
import { tgviMenuPage } from './tgviMenuPage'
import { tgviSignatureDialog } from './tgviSignatureDialog'

/** Each TGVI endpoint (by URL fragment) and its synthetic answer. */
export const tgviRoutes = (
  fake: FakeTgvi,
): [string, () => TgviFakeAnswer][] => {
  return [
    [
      'DialogoRepresentacion',
      () => ({
        text: tgviMenuPage('00000000T', fake.representedAfterSwitch),
        headers: {},
      }),
    ],
    [
      'InicializarEnvio',
      () => ({
        text: '',
        headers: fake.start ?? { codigo: '0', idenvio: 'ID1' },
      }),
    ],
    [
      'EnviarDatos',
      () => ({
        text: '',
        headers: fake.totals ?? {
          codigo: '0',
          totalt2ok: '1',
          totalt2ko: '0',
          avisos: 'N',
        },
      }),
    ],
    ['RecuperarErrores', () => ({ text: fake.errors ?? '', headers: {} })],
    [
      'MostrarDlgFirma',
      () => ({
        text: tgviSignatureDialog(fake.shownHeader ?? ''),
        headers: {},
      }),
    ],
    [
      'PresentarEnvio',
      () => ({
        text: '',
        headers: fake.presented ?? { codigo: '0', csv: 'CSVPRUEBA' },
      }),
    ],
    ['KATA-APLI', () => ({ text: '%PDF-1.4 justificante', headers: {} })],
  ]
}
