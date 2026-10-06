/** What `EECA-FICH/UploadSv` answers for one stored file; the registry form references it by these values. */
export type UploadedFile = {
  readonly coleccion: string
  readonly clave: string
  readonly nombre: string
  readonly contentType: string
  readonly huellaAodit: string
  readonly size: string
}
