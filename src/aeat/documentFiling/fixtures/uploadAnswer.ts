/** A synthetic `UploadSv` success answer for the key given. */
export const uploadAnswer = (clave: string, nombre: string): string =>
  JSON.stringify({
    success: 'true',
    clave,
    coleccion: 'EECAFICH',
    huella: 'AAAA',
    huellaAodit: 'BBBB',
    algoritmoAodit: 'SHA-256',
    contentType: 'application/pdf',
    nombre,
    formato: '.PDF',
    size: '000000010',
    filePath: nombre,
  })
