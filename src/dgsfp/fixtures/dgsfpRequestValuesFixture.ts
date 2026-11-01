import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import { dgsfpFieldValueFixture } from './dgsfpFieldValueFixture'

/** Synthetic form values for the request document: a visible section with a field excluded from the final report and an attachment, and a hidden section. */
export const dgsfpRequestValuesFixture: DgsfpFormValues = {
  tituloFormulario: 'Reclamación ante el Servicio',
  secciones: [
    {
      nombre: 'Datos del reclamante',
      visible: true,
      lineasSeccion: [
        {
          campos: [
            dgsfpFieldValueFixture({ etiqueta: 'NIF', value: '00000000T' }),
            dgsfpFieldValueFixture({
              etiqueta: 'Interno',
              value: 'oculto',
              ocultarInformeFinal: true,
            }),
            null,
          ],
        },
        {
          campos: [
            dgsfpFieldValueFixture({
              etiqueta: 'Escrito',
              tipo: 'DatosControlFichero',
              multiple: [{ key: 'abc123', value: 'escrito.pdf' }],
            }),
          ],
        },
      ],
    },
    {
      nombre: 'Sección invisible',
      visible: false,
      lineasSeccion: [
        { campos: [dgsfpFieldValueFixture({ value: 'no debe salir' })] },
      ],
    },
  ],
}
