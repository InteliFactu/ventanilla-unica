/**
 * The id of the `direcciones` option the form's script marks
 * `.selected=true`: the last `options[N].value="<id>"` written for that N
 * before the selection. Undefined when the script selects none.
 */
export const readSelectedAddressId = (html: string): string | undefined => {
  const selected =
    /"direcciones"\+modo\)\.options\[(\d+)\]\.selected=true/.exec(html)
  if (selected === null) return undefined
  return [
    ...html
      .slice(0, selected.index)
      .matchAll(/"direcciones"\+modo\)\.options\[(\d+)\]\.value="(\d+)"/g),
  ]
    .filter((match) => match[1] === selected[1])
    .at(-1)?.[2]
}
