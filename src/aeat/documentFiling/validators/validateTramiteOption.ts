/** `--tramite`: the registry's trámite code, as a procedure's link carries it (GZ285), upper-cased. */
export const validateTramiteOption = (value: string | undefined): string => {
  const tramite = value?.toUpperCase() ?? ''
  if (!/^[A-Z]{1,2}\d{2,4}$/.test(tramite))
    throw new Error('--tramite must be a trámite code such as GZ285')
  return tramite
}
