import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import type { IriaAjaxRequest } from '../types/IriaAjaxRequest'

/**
 * Press a PrimeFaces button the way its `PrimeFaces.ab` onclick does: a
 * partial-ajax POST naming the button as source, with the form's own fields.
 */
export const postIriaAjax = async (
  client: HttpClient,
  url: string,
  ajax: IriaAjaxRequest,
): Promise<HttpResponse> =>
  client.request(url, {
    method: 'POST',
    referer: url,
    headers: {
      'Faces-Request': 'partial/ajax',
      'X-Requested-With': 'XMLHttpRequest',
    },
    form: {
      'javax.faces.partial.ajax': 'true',
      'javax.faces.source': ajax.source,
      'javax.faces.partial.execute': ajax.form,
      ...(ajax.render ? { 'javax.faces.partial.render': ajax.render } : {}),
      [ajax.source]: ajax.source,
      [ajax.form]: ajax.form,
      ...ajax.fields,
      'javax.faces.ViewState': ajax.viewState,
    },
  })
