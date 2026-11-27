export const registryEntryFixture = (
  number: string,
): Record<string, unknown> => ({
  numRegistro: number,
  fechaRegistro: '2026-10-05T15:14:22.000+0000',
  dsOficinaRegistroInicio: 'Registro Electrónico de Ejemplo',
  cdIntercambio: `O00000001_26_${number}`,
  anotaciones: [
    {
      cdEstado: '09',
      descripcionCatalogo: 'Confirmado',
      fechaAnotacion: '2026-10-06T09:00:00.000+0000',
      observaciones: 'Aceptado en destino',
      dsOrOrigen: 'Unidad de Ejemplo',
    },
    {
      cdEstado: '02',
      descripcionCatalogo: 'Enviado',
      fechaAnotacion: '2026-10-05T15:14:30.000+0000',
    },
  ],
  interesados: [
    {
      nombre_interesado: 'ANA',
      apellido1_interesado: 'PÉREZ',
      apellido2_interesado: '',
      num_doc_ident_interesado: '00000000T',
    },
  ],
})
