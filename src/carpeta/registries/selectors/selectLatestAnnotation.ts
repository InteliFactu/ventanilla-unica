import { parseAnnotationTime } from '../parsers/parseAnnotationTime'
import type { RegistryAnnotation } from '../types/RegistryAnnotation'

/**
 * The most recent annotation. The front reads the state from the array's ends
 * (and reverses it in place on every render), so its order is not trusted:
 * the latest `fechaAnotacion` instant wins (offsets are honoured, not compared
 * as text), and among undated or unparseable ones the last item.
 */
export const selectLatestAnnotation = (
  annotations: readonly RegistryAnnotation[],
): RegistryAnnotation | undefined =>
  annotations.reduce<RegistryAnnotation | undefined>(
    (latest, annotation) =>
      latest === undefined ||
      (parseAnnotationTime(annotation.at) ?? -Infinity) >=
        (parseAnnotationTime(latest.at) ?? -Infinity)
        ? annotation
        : latest,
    undefined,
  )
