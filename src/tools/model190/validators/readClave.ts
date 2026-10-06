/** The clave de percepción; only A and L are written by this tool. */
export const readClave = (value: string | undefined): 'A' | 'L' => {
  const clave = (value ?? '').trim().toUpperCase()
  if (clave === 'A' || clave === 'L') return clave
  throw new Error(
    `modelo 190: clave "${clave}" is not supported; only A and L are`,
  )
}
