import type { TimestampPost } from '../types/TimestampPost'
import { buildTestTimestampReply } from './buildTestTimestampReply'

/** A TSA for tests that grants every query with `buildTestTimestampReply`. */
export const answerTestTimestamp: TimestampPost = async (_url, query) => {
  await Promise.resolve()
  return buildTestTimestampReply(query)
}
