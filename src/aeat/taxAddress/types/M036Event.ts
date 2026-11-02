/** One ZK client event the BU36-M036 desktop accepts. */
export type M036Event = {
  readonly cmd:
    | 'onChange'
    | 'onCheck'
    | 'onClick'
    | 'onSelect'
    | 'onPresenvali'
    | 'onValorDevuelto'
  readonly uuid: string
  readonly data: Readonly<Record<string, unknown>>
}
