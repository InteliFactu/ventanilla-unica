/** One control digit of a Spanish CCC over ten digits: weights 1,2,4,8,5,10,9,7,3,6, modulo 11. */
export const cccControlDigit = (digits: string): number => {
  const weights = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6]
  const modulus = 11
  const sum = Array.from(digits).reduce(
    (total, digit, index) => total + Number(digit) * (weights[index] ?? 0),
    0,
  )
  const digit = modulus - (sum % modulus)
  if (digit === modulus) return 0
  return digit === modulus - 1 ? 1 : digit
}
