/** One ZK client event the BU36-M036 desktop accepts. */
export type M036Event = {
  readonly cmd:
    | 'onChange'
    | 'onCheck'
    | 'onClick'
    | 'onSelect'
    | 'onPresenvali'
    | 'onValorDevuelto'
  /** The target widget; absent for a desktop-level event such as the `onPresenvali` echo. */
  readonly uuid?: string
  readonly data: Readonly<Record<string, unknown>>
}
