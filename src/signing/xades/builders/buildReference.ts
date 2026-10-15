import type { BuiltReference } from '../types/BuiltReference'
import type { ReferenceSpec } from '../types/ReferenceSpec'
import { buildDigestElements } from './buildDigestElements'
import { buildElement } from './buildElement'
import { buildText } from './buildText'

/** A ds:Reference with an empty DigestValue to fill once the tree is final. */
export const buildReference = (
  ds: string,
  spec: ReferenceSpec,
  digestUri: string,
): BuiltReference => {
  const digest = buildText('')
  const transforms =
    spec.transforms.length === 0
      ? []
      : [
          buildElement(
            `${ds}:Transforms`,
            {},
            spec.transforms.map((algorithm) =>
              buildElement(`${ds}:Transform`, { Algorithm: algorithm }),
            ),
          ),
        ]
  const element = buildElement(
    `${ds}:Reference`,
    {
      ...(spec.id === undefined ? {} : { Id: spec.id }),
      ...(spec.type === undefined ? {} : { Type: spec.type }),
      URI: spec.uri,
    },
    [...transforms, ...buildDigestElements(ds, digestUri, digest)],
  )
  return { element, pending: { target: spec.target, digest } }
}
