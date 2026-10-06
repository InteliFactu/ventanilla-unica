/** A synthetic perceptor CSV: two clave A workers and one clave L row; no real person. */
export const perceptorCsv = [
  'nif,nombre,provincia,clave,subclave,percepcion,retencion,gastos,nacimiento,situacion,contrato',
  '00000001R,"PEREZ PEÑA, JOSÉ",10,A,,"1.234,56",24.69,78.90,1990,,2',
  '00000002W,GOMEZ GOMEZ ANA,06,A,,100,0,6.35,2001,3,1',
  '00000002W,GOMEZ GOMEZ ANA,06,L,05,1.6,,,,,',
  '',
].join('\n')
