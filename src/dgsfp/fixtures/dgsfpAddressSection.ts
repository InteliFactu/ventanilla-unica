import type { DgsfpSection } from '../types/DgsfpSection'

/** The synthetic notice-address section, with the hidden department preset. */
export const dgsfpAddressSection: DgsfpSection = {
  nombre: 'DIRECCIÓN',
  lineasSeccion: [
    {
      controles: [
        {
          nombre: 'Scorreoaviso',
          tipo: 'DatosControlTexto',
          etiqueta: 'Correo de aviso',
        },
        {
          nombre: 'sDireccionNP',
          tipo: 'DatosControlTexto',
          etiqueta: 'Direccion',
        },
        {
          nombre: 'iprovinciaNP',
          tipo: 'DatosControlLista',
          etiqueta: 'Provincia',
          ValorPredeterminado: '',
        },
        {
          nombre: 'iMunicipioNP',
          tipo: 'DatosControlLista',
          etiqueta: 'Municipios',
        },
        {
          nombre: 'sPoblacionNP',
          tipo: 'DatosControlTexto',
          etiqueta: 'Población',
        },
        {
          nombre: 'sCodigoPostalNP',
          tipo: 'DatosControlNumerico',
          etiqueta: 'Código Postal',
          ValorPredeterminado: 0,
        },
        {
          nombre: 'sMovilNP',
          tipo: 'DatosControlNumerico',
          etiqueta: 'Teléfono Móvil',
          ValorPredeterminado: 0,
        },
        {
          nombre: 'sMailNP',
          tipo: 'DatosControlEmail',
          etiqueta: 'Correo electrónico',
        },
        {
          nombre: 'sDepartamento',
          tipo: 'DatosControlTexto',
          etiqueta: '',
          ValorPredeterminado: '1',
          oculto: true,
          ocultarInformeFinal: true,
        },
      ],
    },
  ],
}
