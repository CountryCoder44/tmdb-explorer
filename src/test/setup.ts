import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement IntersectionObserver, which Motion's `whileInView`
// relies on for scroll-triggered entrance animations.
class MockIntersectionObserver {
  root = null
  rootMargin = ''
  scrollMargin = ''
  thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver)
