/** Step-4 occupation and step-5 interest/sector selects only fill an add-row sub-flow. */
export const isYouthGuaranteeRowField = (step: number, name: string): boolean =>
  (step === 4 || step === 5) &&
  /(?:^|\.)tcod(?:Ocupacion|InteresOcupacion|Sector)$/.test(name)
