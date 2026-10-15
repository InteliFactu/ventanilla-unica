/** Send a DER TimeStampReq to the TSA at `url` and return its DER TimeStampResp. */
export type TimestampPost = (url: string, query: Buffer) => Promise<Buffer>
