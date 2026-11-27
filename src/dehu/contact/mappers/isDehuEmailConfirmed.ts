/** DEHU calls status 1 verified and status 2 activated. */
export const isDehuEmailConfirmed = (status: unknown): boolean =>
  status === 1 || status === 2 || status === '1' || status === '2'
