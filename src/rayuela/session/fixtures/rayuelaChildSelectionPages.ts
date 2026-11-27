/** Menu, navigation and roster from a synthetic two-pupil account. */
export const rayuelaChildSelectionPages = (navigation: string): string[] => [
  `var c_HoraAlumno= 456; var c_DetDatMisHij= 321; <div accion="('HoraAlumno','789','x')"><div accion="('DetDatMisHij','789','x')">`,
  navigation,
  '<TABLE id="CONT">Nombre:&nbsp;<font class="columnaValor">Example, Dana</font> NIA:&nbsp;<font class="columnaValor">543</font></TABLE><TABLE id="CONT">Nombre:&nbsp;<font class="columnaValor">Example, River</font> NIA:&nbsp;<font class="columnaValor">456</font></TABLE>',
]
