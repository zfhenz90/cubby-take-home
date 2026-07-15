import type { Product } from '../types/product'
import { CUBBY_2_PRODUCT } from '../data/product'
import { delay } from './delay'

/**
 * Mock product service — the seam between the view and its data source.
 *
 * Components depend only on this function, never on where the data lives. Today it
 * returns a local typed constant after a simulated delay; swapping to a real backend
 * means changing this body to `fetch('/api/products/cubby-2')` (and validating the
 * response against the `Product` type) with zero changes to any component.
 *
 * NEXT STEP once real endpoints exist: mock at the network layer with MSW so app and
 * tests share identical request handling. A hand-written module is the right,
 * lighter-weight choice while there is no HTTP layer to intercept.
 *
 * @param latencyMs simulated latency; pass 0 in tests.
 */
export async function getProduct(latencyMs = 400): Promise<Product> {
  await delay(latencyMs)
  return CUBBY_2_PRODUCT
}
