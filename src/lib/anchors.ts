/** DOM id for a single document card, so coverage results can deep-link to it. */
export function documentAnchorId(docId: string): string {
  return `doc-${docId}`
}
