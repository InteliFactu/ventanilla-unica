/** A holder as `/people/me` returns one, with a default e-mail contact. */
export const registryPersonFixture = {
  dboid: 'P1',
  name: 'ANA',
  familyname: 'LOPEZ',
  secondname: 'RUIZ',
  idnumber: '012345678',
  ctrldigit: 'Z',
  persontype: 'F',
  addreses: [{ street: 'X' }],
  contacts: [{ waycode: '21', wayvalue: 'ana@example.es', default: true }],
  represented: null,
}
