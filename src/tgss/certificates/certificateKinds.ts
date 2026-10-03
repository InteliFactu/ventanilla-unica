import type { CertificateKind } from './types/CertificateKind'
import type { CertificateKindInfo } from './types/CertificateKindInfo'

/**
 * The certificate options of the AECPSED1 entry screen
 * (`listadoInformeOCertificado`, `claseDocumento` C), read live on
 * 2026-09-25. Options 6 and 7 are the debt reports, served by `tgss deuda`.
 */
export const certificateKinds: Readonly<
  Record<CertificateKind, CertificateKindInfo>
> = {
  generico: {
    value: '1',
    label: 'Genérico',
    purpose: 'up-to-date certificate with no specific purpose',
    needsDate: false,
    needsContractingEntity: false,
  },
  licitacion: {
    value: '2',
    label: 'Licitación contratos del Sector Público',
    purpose:
      'up-to-date certificate for public-sector tenders (art. 71.1.d Ley 9/2017)',
    needsDate: false,
    needsContractingEntity: true,
  },
  subvenciones: {
    value: '3',
    label: 'Subvenciones',
    purpose:
      'up-to-date certificate for grants and subsidies (art. 13.2.e Ley 38/2003)',
    needsDate: false,
    needsContractingEntity: false,
  },
  'articulo-42': {
    value: '5',
    label: 'Artículo 42',
    purpose:
      'certificate for a contractor or subcontractor (art. 42 Estatuto de los Trabajadores); the principal must have enabled it first',
    needsDate: false,
    needsContractingEntity: false,
  },
  'sin-deuda-fecha': {
    value: '4',
    label: 'Sin deuda a una fecha',
    purpose: 'up-to-date certificate at an earlier date, no specific purpose',
    needsDate: true,
    needsContractingEntity: false,
  },
  'licitacion-fecha': {
    value: '8',
    label: 'Licitación contratos del Sector Público sin deuda a una fecha',
    purpose: 'tender certificate at an earlier date',
    needsDate: true,
    needsContractingEntity: true,
  },
  'subvenciones-fecha': {
    value: '9',
    label: 'Subvenciones sin deuda a una fecha',
    purpose: 'grants certificate at an earlier date',
    needsDate: true,
    needsContractingEntity: false,
  },
}
