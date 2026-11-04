export const youthGuaranteeUrls = {
  origin: 'https://garantiajuvenil.sepe.es',
  login: 'https://garantiajuvenil.sepe.es/loginClave',
  history:
    'https://garantiajuvenil.sepe.es/tablaHistoricoSitSolicitante.action',
  page: (step: number): string =>
    `https://garantiajuvenil.sepe.es/solicitudPaso${String(step)}`,
} as const
