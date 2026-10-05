import type { DgsfpSection } from '../types/DgsfpSection'

/** The synthetic complaint section: dates, entities, files and the litigation declaration. */
export const dgsfpComplaintSection: DgsfpSection = {
  nombre: 'RECLAMACIÓN',
  lineasSeccion: [
    {
      controles: [
        {
          nombre: 'sAccion',
          tipo: 'DatosControlTexto',
          etiqueta: 'Acciones judiciales',
        },
        null,
        {
          nombre: 'dFechaPresentacion',
          tipo: 'DatosControlFecha',
          etiqueta: 'Fecha presentación SAC',
        },
        {
          nombre: 'sEntR',
          tipo: 'DatosControlTextoMultilinea',
          etiqueta: 'Entidades reclamadas',
        },
        {
          nombre: 'sMotivo',
          tipo: 'DatosControlFichero',
          etiqueta: 'Resumen',
        },
        {
          nombre: 'bFirmante',
          tipo: 'DatosControlSiNo',
          etiqueta: 'Firmante',
          ValorPredeterminado: false,
        },
        {
          nombre: 'fCondicionesGenerales',
          tipo: 'DatosControlFichero',
          etiqueta: 'Condiciones',
        },
        {
          nombre: 'fSACDEC',
          tipo: 'DatosControlFichero',
          etiqueta: 'Documento SAC',
        },
        {
          nombre: 'sAnexos',
          tipo: 'DatosControlFichero',
          etiqueta: 'Otra documentación',
        },
        {
          nombre: 'cboDepartamento',
          tipo: 'DatosControlLista',
          etiqueta: 'Departamento',
          ValorPredeterminado: null,
        },
      ],
    },
  ],
}
