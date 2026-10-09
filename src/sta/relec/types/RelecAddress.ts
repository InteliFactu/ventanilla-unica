/** The postal address the form selects for the holder: its id and the field values it fills. */
export type RelecAddress = {
  readonly id: string
  readonly fields: Readonly<Record<string, string>>
}
