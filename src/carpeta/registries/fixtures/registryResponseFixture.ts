export const registryResponseFixture = (
  asientos: unknown[],
  total: unknown,
  code: number | string | null = 0,
  text = '',
): string =>
  JSON.stringify({
    registroResponse: {
      codigoRespuesta: { codRespuesta: code, textoRespuesta: text },
      resultados: { num_total_resultados: total },
      asientos,
    },
  })
