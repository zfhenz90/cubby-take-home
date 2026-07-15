import { useEffect, useState } from 'react'
import type { Product } from '../types/product'
import { getProduct } from '../services/productService'

/** Exhaustive load state so views must handle loading and error, not just success. */
export type ProductState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; product: Product }

/**
 * Load the product through the service seam. Guards against setting state after
 * unmount so a slow response can't update a torn-down component.
 */
export function useProduct(): ProductState {
  const [state, setState] = useState<ProductState>({ status: 'loading' })

  useEffect(() => {
    // Initial state is already 'loading'; the effect only records the outcome.
    let active = true

    getProduct()
      .then((product) => {
        if (active) setState({ status: 'success', product })
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            status: 'error',
            error: err instanceof Error ? err : new Error('Failed to load product'),
          })
        }
      })

    return () => {
      active = false
    }
  }, [])

  return state
}
