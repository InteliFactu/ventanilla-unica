import type { DehuContactSlot } from '../types/DehuContactSlot'

/** The five `emailN` / `emailN_confirmacion` pairs the PUT carries, the given slots first and the rest empty. */
export const contactSlotFields = (
  slots: readonly DehuContactSlot[],
): Record<string, unknown> =>
  Object.fromEntries(
    [0, 1, 2, 3, 4].flatMap((index) => [
      [`email${String(index + 1)}`, slots[index]?.email ?? null],
      [`email${String(index + 1)}_confirmacion`, slots[index]?.status ?? 0],
    ]),
  )
