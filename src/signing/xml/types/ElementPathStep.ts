import type { XmlElement } from './XmlElement'

/** An element still to visit and the path from the root that reached it. */
export type ElementPathStep = { element: XmlElement; path: XmlElement[] }
