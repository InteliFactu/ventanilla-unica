/** The active record's explicit statement that the holder is a beneficiary. */
export const readYouthGuaranteeBeneficiaryBanner = (
  text: string,
): string | undefined =>
  /Actualmente se encuentra como beneficiari[oa] del sistema de Garant[ií]a Juvenil\./iu.exec(
    text,
  )?.[0]
