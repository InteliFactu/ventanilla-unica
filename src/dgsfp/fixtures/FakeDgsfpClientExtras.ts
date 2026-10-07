import type { DgsfpCall } from './DgsfpCall'

/** The calls a fake DGSFP client recorded. */
export type FakeDgsfpClientExtras = { readonly calls: DgsfpCall[] }
