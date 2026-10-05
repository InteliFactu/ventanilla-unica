import { fileDgsfpComplaint } from '../../dgsfp/fileDgsfpComplaint'
import { validateComplaintQuery } from '../../dgsfp/validators/validateComplaintQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const dgsfpReclamacion: Command = {
  portal: 'dgsfp',
  action: 'reclamacion',
  description:
    "File a complaint with the DGSFP's Servicio de Reclamaciones against an insurer or distributor, in the holder's own name with electronic notification (--entidad, --nif-entidad, [--detalle-entidad], [--fecha-sac YYYY-MM-DD], [--acciones-judiciales], --email, [--telefono], --direccion, --provincia, --municipio, [--poblacion], --cp, --escrito writ.pdf, --sac proof.pdf, [--condiciones policy.pdf], [--anexo annex.pdf], --declaro-no-litigio si); --confirmar si to file, with --out to save the justificante",
  options: [
    'entidad',
    'nif-entidad',
    'detalle-entidad',
    'fecha-sac',
    'acciones-judiciales',
    'email',
    'telefono',
    'direccion',
    'provincia',
    'municipio',
    'poblacion',
    'cp',
    'escrito',
    'sac',
    'condiciones',
    'anexo',
    'declaro-no-litigio',
  ],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'dgsfp reclamacion needs the holder certificate (--cert/--key)',
      )
    return fileDgsfpComplaint(client, validateComplaintQuery(options), {
      identity,
      confirmed: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
