import { readRayuelaCells } from './readRayuelaCells'
/** Header rows are excluded from the returned data. */
export const readRayuelaRows = (table: string): string[][] =>
  Array.from(table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi))
    .filter((match) => !/<th\b/i.test(match[1] ?? ''))
    .map((match) => readRayuelaCells(match[1] ?? ''))
