import { tgviBlockRecords } from './tgviBlockRecords'

/** The type 2 records joined into the bodies of consecutive EnviarDatos calls. */
export const chunkRecords = (records: readonly string[]): string[] => {
  const blocks: string[] = []
  for (let start = 0; start < records.length; start += tgviBlockRecords)
    blocks.push(records.slice(start, start + tgviBlockRecords).join(''))
  return blocks
}
