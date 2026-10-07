import type { DgsfpAttachedFile } from '../types/DgsfpAttachedFile'
import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import type { DgsfpRegisterParts } from '../types/DgsfpRegisterParts'
import type { DgsfpRegisterRequest } from '../types/DgsfpRegisterRequest'

/**
 * The `PeticionRegistrarPresentacion` the page's signature callback builds:
 * both request documents in base64, the signer's certificate, the title and
 * telematic number, the form values as a JSON string, and one entry per file
 * held by a file control, in form order (a single-file control's entry has an
 * empty title because its `key` is empty).
 */
export const buildRegisterRequest = (
  values: DgsfpFormValues,
  datosFormulario: string,
  parts: DgsfpRegisterParts,
): DgsfpRegisterRequest => {
  const files = values.secciones
    .flatMap((section) => section.lineasSeccion)
    .flatMap((line) => line.campos)
    .filter((field) => field?.tipo === 'DatosControlFichero')
    .flatMap((field) =>
      (field?.multiple ?? []).map((file): DgsfpAttachedFile => ({
        titulo: '',
        descripcion: '',
        nombreArchivo: file.value,
        hash: file.key,
        nombreCampo: field?.nombre ?? '',
        index: 0,
        documentosExtranet: [],
      })),
    )
  return {
    ficherosAdjuntos: files,
    ficherosAdjuntosConNombreAsociado: [],
    documentosExtranet: [],
    accionesFormulario: [],
    formularioPdfB64: parts.document.toString('base64'),
    formularioPdfFirmadoB64: parts.signedDocument.toString('base64'),
    certificadoUsuarioFirmaB64: parts.certificateDerBase64,
    tituloPresentacion: values.tituloFormulario,
    numTelematico: parts.numTelematico,
    datosFormulario,
    ficherosInformesPlanes: [],
  }
}
