/**
 * A local page that opens the hosted checkout as `pago-orden` does: an
 * auto-submitted POST with no fields. The URL comes from `readCheckoutUrl`,
 * which admits no quote or angle bracket, so only `&` needs escaping.
 */
export const mapCheckoutPage = (checkoutUrl: string): string =>
  [
    '<!doctype html>',
    '<meta charset="utf-8"><title>Pago nota informativa mercantil</title>',
    `<form id="pago" method="post" action="${checkoutUrl.replaceAll('&', '&amp;')}"><button type="submit">Pagar</button></form>`,
    '<script>document.getElementById("pago").submit()</script>',
  ].join('\n')
