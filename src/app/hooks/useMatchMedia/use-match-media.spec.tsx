import { renderHook, act } from '@testing-library/react'
import { useMatchMedia } from '.'

// Define an array of queries corresponding to those used in the hook
const queries = [
  '(min-width: 1025px)', // large desktop
  '(min-width: 769px) and (max-width: 1024px)', // desktop
  '(min-width: 481px) and (max-width: 768px)', // tablet
  '(max-width: 480px)', // mobile
]

// Function to create a mock object for matchMedia
const createMatchMediaMock = (matches: boolean, query: string) => {
  let listener: ((event: MediaQueryListEvent) => void) | null = null

  return {
    matches,
    media: query,
    onchange: null,
    addEventListener: jest.fn((event, cb) => {
      if (event === 'change') listener = cb as (event: MediaQueryListEvent) => void
    }),
    removeEventListener: jest.fn((event, cb) => {
      if (event === 'change' && listener === cb) listener = null
    }),
    dispatchEvent: jest.fn(),
    trigger(newMatches: boolean) {
      this.matches = newMatches
      listener?.({ matches: newMatches, media: query } as MediaQueryListEvent)
    },
  }
}

// Helper function to set matchMedia mocks
const setMatchMediaMocks = (matchesArray: boolean[]) => {
  const mediaQueryLists: Record<string, ReturnType<typeof createMatchMediaMock>> = {}

  queries.forEach((query, index) => {
    mediaQueryLists[query] = createMatchMediaMock(matchesArray[index], query)
  })

  window.matchMedia = jest.fn((query) => mediaQueryLists[query] as unknown as MediaQueryList)

  return mediaQueryLists
}

// Helper function for expectation
const expectMediaResult = (result: ReturnType<typeof renderHook>['result'], expected: boolean[]) => {
  expect(result.current).toEqual({
    isLargeDesktop: expected[0],
    isDesktop: expected[1],
    isTablet: expected[2],
    isMobile: expected[3],
  })
}

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
