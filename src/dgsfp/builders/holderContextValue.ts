import type { DgsfpHolder } from '../types/DgsfpHolder'

/** The holder datum a label control shows for its `TipoValorContexto` (the page's `TipoValorContextoSP` enum). */
export const holderContextValue = (
  holder: DgsfpHolder,
  kind: string,
): string | undefined =>
  ({
    'NIF/CIF': holder.identificador,
    Nombre: holder.nombre,
    'Primer Apellido': holder.apellido1,
    'Segundo Apellido': holder.apellido2,
    'En Representación de': holder.enRepresentacionDe,
  })[kind]
