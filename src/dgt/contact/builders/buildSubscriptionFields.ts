import type { DgtContactQuery } from '../types/DgtContactQuery'

/**
 * The fields "Mis datos de contacto y suscripciones" posts. `radio-all` is
 * the alta in the avisos service: the sede says the email and phone given
 * there are the ones the DGT uses to communicate, so registering contact data
 * means subscribing; the avisos never carry sanctions or administrative
 * notifications. `checkrgpd` is the data-protection acceptance the form requires.
 */
export const buildSubscriptionFields = (
  query: DgtContactQuery,
): Record<string, string> => ({
  txtEmail: query.email,
  telefono: query.telefono,
  'radio-all': 'radioAll',
  checkrgpd: 'on',
  update: 'true',
})
