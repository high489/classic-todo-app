import { renderHook, act } from '@testing-library/react'
import { useMatchMedia } from '.'
import {
  queries,
  setMatchMediaMocks,
  expectMediaResult,
} from './test.setup'

describe('useMatchMedia', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  test.each([
    { matches: [false, false, false, true], expected: [false, false, false, true], label: 'mobile' },
    { matches: [false, false, true, false], expected: [false, false, true, false], label: 'tablet' },
    { matches: [false, true, false, false], expected: [false, true, false, false], label: 'desktop' },
    { matches: [true, false, false, false], expected: [true, false, false, false], label: 'large desktop' },
  ])('should return correct values for $label screen size', ({ matches, expected }) => {
    setMatchMediaMocks(matches)
    const { result } = renderHook(() => useMatchMedia())
    expectMediaResult(result, expected)
  })

  test('should update values when screen size changes', () => {
    const mediaQueryMocks = setMatchMediaMocks([false, false, false, true])
    const { result } = renderHook(() => useMatchMedia())

    expectMediaResult(result, [false, false, false, true])

    const changeScreen = (from: number, to: number) => {
      act(() => {
        mediaQueryMocks[queries[from]].trigger(false)
        mediaQueryMocks[queries[to]].trigger(true)
      })
      expectMediaResult(result, queries.map((_, i) => i === to))
    }

    changeScreen(3, 2) // mobile to tablet
    changeScreen(2, 1) // tablet to desktop
    changeScreen(1, 0) // desktop to large desktop
  })
})
