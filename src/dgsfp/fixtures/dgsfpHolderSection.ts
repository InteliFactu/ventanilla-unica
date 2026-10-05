/** The reusable presenter section (41) as `ObtenerSeccion` answers it: its definition is a JSON string. */
export const dgsfpHolderSection = {
  ID: 41,
  nombre: 'PRESENTADOR',
  jsonSeccion: JSON.stringify({
    nombre: 'PRESENTADOR',
    lineasSeccion: [
      {
        controles: [
          {
            nombre: 'sNif',
            tipo: 'DatosControlEtiqueta',
            etiqueta: 'NIF/CIF',
            TipoValorContexto: 'NIF/CIF',
          },
          {
            nombre: 'sNombre',
            tipo: 'DatosControlEtiqueta',
            etiqueta: 'Nombre',
            TipoValorContexto: 'Nombre',
          },
          {
            nombre: 'sOtro',
            tipo: 'DatosControlEtiqueta',
            etiqueta: 'Otro',
            TipoValorContexto: 'Desconocido',
          },
        ],
      },
    ],
  }),
}
