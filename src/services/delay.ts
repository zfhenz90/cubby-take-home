/**
 * Resolve after `ms` milliseconds. Used to simulate network latency in the mock
 * services so the UI exercises real loading states. Latency is injectable everywhere
 * so tests can pass 0 and never depend on timers.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
