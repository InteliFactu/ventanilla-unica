import type { EmployerAccount } from './EmployerAccount'

/** What `tgss ccc` reports: the holder and every account RETC0001 lists. */
export type EmployerAccountsResult = {
  readonly titular: string
  readonly accounts: readonly EmployerAccount[]
  readonly notes: readonly string[]
}
