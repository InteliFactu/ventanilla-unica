import { pasarelaModelos } from '../pasarelaModelos'

/** True for a modelo the account-debit form accepts. */
export const isPasarelaModelo = (modelo: string): boolean =>
  pasarelaModelos.includes(modelo)
