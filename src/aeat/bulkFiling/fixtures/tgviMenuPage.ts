/** The user menu of a synthetic TGVI page: the holder's NIF, then the represented one (blank when acting in one's own name). */
export const tgviMenuPage = (holder: string, represented = ''): string => `
<small class="d-flex text-secondary">Representante</small>
<span class="aeat--username">PRUEBA PRUEBA PEPE</span>
<small class="d-block text-secondary">${holder}</small>
<small class="d-block font-weight-bold text-secondary">En nombre propio</small>
<span class="aeat--username-representado"></span>
<small class="d-block text-secondary">${represented}</small>`
