import type { DgsfpComplaintFacts } from '../types/DgsfpComplaintFacts'
import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'
import type { DgsfpHolder } from '../types/DgsfpHolder'

/** What a confirmed run would file and every request it would send, for the holder to read before `--confirmar si`. */
export const mapComplaintPlan = (
  holder: DgsfpHolder,
  query: DgsfpComplaintQuery,
  facts: DgsfpComplaintFacts,
): readonly string[] => [
  `File complaint ${facts.numTelematico} at sededgsfp.gob.es as ${holder.nombre} ${holder.apellido1} ${holder.apellido2} (${holder.identificador}), in own name`,
  `Against: ${query.entity} (NIF ${query.entityNif})${query.entityDetail === '' ? '' : ` — ${query.entityDetail}`}`,
  `Prior complaint to the entity's customer service filed on: ${query.sacDate ?? 'not given'}`,
  `Electronic notification, notice to ${query.email}; address ${query.address}, ${query.postalCode} ${facts.place.municipality.value} (${facts.place.province.value})${query.phone === '' ? '' : `, mobile ${query.phone}`}`,
  'Declares the complaint is not pending before a court, an arbitrator or another administrative body',
  ...facts.files.map(
    (file) =>
      `POST FilePondRestService.svc/process: ${file.field} <- ${file.name} (${String(file.content.length)} bytes, sha256 ${file.hash})`,
  ),
  ...facts.files.map(
    (file) => `POST comprobarAdjuntoPresentacion: ${file.name}`,
  ),
  'POST validarCodigoPostal, guardarBorradorPresentacion, generarHMAC',
  'Sign the request document locally (PAdES, the holder certificate)',
  'POST registrarPresentacionTelematica: the legal act; answers registry number, date and CSV',
]
