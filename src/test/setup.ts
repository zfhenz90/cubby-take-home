import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// React Testing Library does not auto-clean between tests under Vitest globals,
// so unmount rendered trees to keep tests isolated.
afterEach(() => {
  cleanup()
})
