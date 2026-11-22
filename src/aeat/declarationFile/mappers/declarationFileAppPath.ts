/** The ZK application that presents one model by file, e.g. `/wlpl/PAIV-M390` for the 390. */
export const declarationFileAppPath = (modelo: string): string =>
  `/wlpl/PAIV-M${modelo}`
