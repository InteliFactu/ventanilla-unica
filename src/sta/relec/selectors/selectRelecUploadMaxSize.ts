import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/** Honour a catalogue row's KB limit, capped by the existing 50000 KB client limit. */
export const selectRelecUploadMaxSize = (target: RelecUploadTarget): number => {
  const offered =
    target.popupUrl === undefined
      ? 0
      : Number(new URL(target.popupUrl).searchParams.get('maxSize'))
  return Number.isFinite(offered) && offered > 0
    ? Math.min(offered, 50_000)
    : 50_000
}
