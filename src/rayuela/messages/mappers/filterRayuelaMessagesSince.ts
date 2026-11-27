import type { RayuelaMessages } from '../types/RayuelaMessages'

/** Filter the fetched page by id while keeping the tray's unfiltered total. */
export const filterRayuelaMessagesSince = (
  page: RayuelaMessages,
  threshold: bigint | undefined,
): RayuelaMessages =>
  threshold === undefined
    ? page
    : {
        ...page,
        messages: page.messages.filter(
          (message) => BigInt(message.id) > threshold,
        ),
      }
