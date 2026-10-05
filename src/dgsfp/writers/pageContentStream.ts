import type { DgsfpDrawText } from '../types/DgsfpDrawText'
import { pdfLiteral } from './pdfLiteral'

/** A page's content stream: one text object per run, `/F1` regular and `/F2` bold Helvetica. */
export const pageContentStream = (runs: readonly DgsfpDrawText[]): string =>
  runs
    .map(
      (run) =>
        `BT /${run.bold ? 'F2' : 'F1'} ${String(run.size)} Tf ${run.x.toFixed(1)} ${run.y.toFixed(1)} Td ${pdfLiteral(run.text)} Tj ET`,
    )
    .join('\n')
