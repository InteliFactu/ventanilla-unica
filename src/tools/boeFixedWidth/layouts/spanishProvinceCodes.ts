/** The province and autonomous city codes shared by both designs. */
export const spanishProvinceCodes: readonly string[] = Array.from(
  { length: 52 },
  (_, index) => String(index + 1).padStart(2, '0'),
)
