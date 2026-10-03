/**
 * The `mode` of a save: `draft` stores progress, `sign` freezes the request
 * and prepares the registry form for signing, `""` submits the signed request.
 */
export type RegistryMode = 'draft' | 'sign' | ''
