/**
 * One ZK client event for the form: command, target widget, `data_0` payload.
 * A desktop-level event (the `onPresenvali` echo after signing) has no target.
 */
export type DraftEvent = {
  readonly cmd: 'onUpload' | 'onClick' | 'onCheck' | 'onPresenvali'
  readonly uuid?: string | undefined
  readonly data: Readonly<Record<string, unknown>>
}
