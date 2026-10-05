import type { DgsfpSection } from '../types/DgsfpSection'
import { dgsfpAddressSection } from './dgsfpAddressSection'
import { dgsfpComplaintSection } from './dgsfpComplaintSection'

/** A synthetic copy of the complaint form's shape (control names and kinds as the sede defines them), with section 41 left as a reusable reference. */
export const dgsfpSectionsFixture: readonly DgsfpSection[] = [
  { nombre: 'PRESENTADOR', seccionReutilizableId: '41', lineasSeccion: [] },
  {
    nombre: 'EN REPRESENTACIÓN DE',
    lineasSeccion: [
      {
        controles: [
          {
            nombre: 'sNIFRepresentacion',
            tipo: 'DatosControlTexto',
            etiqueta: 'NIF / CIF',
            ValorPredeterminado: '',
          },
          {
            nombre: 'fDocumentacionAcreditativa',
            tipo: 'DatosControlFichero',
            etiqueta: 'Documento acreditativo',
            requerido: true,
          },
        ],
      },
    ],
  },
  {
    nombre: 'Medio de notificación',
    lineasSeccion: [
      {
        controles: [
          {
            nombre: 'cbnotificacion',
            tipo: 'DatosControlRadioButtonPanel',
            etiqueta: 'Medio de notificación',
            opciones: [
              { idOpcion: '0', opcion: 'Notificación Postal' },
              { idOpcion: '1', opcion: 'Notificación Electrónica' },
            ],
          },
        ],
      },
    ],
  },
  dgsfpAddressSection,
  dgsfpComplaintSection,
]
