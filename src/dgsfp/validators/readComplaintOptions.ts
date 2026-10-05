import type { CliOptions } from '../../cli/types/CliOptions'
import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'

/** The raw `dgsfp reclamacion` options, trimmed but not yet checked. */
export const readComplaintOptions = (
  options: CliOptions,
): DgsfpComplaintQuery => {
  const text = (name: string): string => (options[name] ?? '').trim()
  const optional = (name: string): string | undefined =>
    text(name) === '' ? undefined : text(name)
  return {
    entity: text('entidad'),
    entityNif: text('nif-entidad').toUpperCase(),
    entityDetail: text('detalle-entidad'),
    sacDate: optional('fecha-sac'),
    lawsuits: text('acciones-judiciales'),
    email: text('email'),
    phone: text('telefono').replaceAll(/[\s.-]/g, ''),
    address: text('direccion'),
    province: text('provincia'),
    municipality: text('municipio'),
    town: text('poblacion'),
    postalCode: text('cp'),
    files: {
      escrito: text('escrito'),
      sac: text('sac'),
      condiciones: optional('condiciones'),
      anexo: optional('anexo'),
    },
  }
}
