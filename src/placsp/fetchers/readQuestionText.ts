import { readContentFile } from '../../signing/xades/fetchers/readContentFile'

/** The question from `--texto-file`: UTF-8 (anything else is refused), trimmed, not empty. */
export const readQuestionText = async (path: string): Promise<string> => {
  const content = await readContentFile(path)
  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(content).trim()
  } catch {
    throw new Error('--texto-file is not UTF-8 text')
  }
  if (text === '') throw new Error('--texto-file is empty')
  return text
}
