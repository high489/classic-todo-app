// Define an array of queries corresponding to those used in the hook
export const queries = [
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
export const setMatchMediaMocks = (matchesArray: boolean[]) => {
  const mediaQueryLists: Record<string, ReturnType<typeof createMatchMediaMock>> = {}

  queries.forEach((query, index) => {
    mediaQueryLists[query] = createMatchMediaMock(matchesArray[index], query)
  })

  window.matchMedia = jest.fn((query) => mediaQueryLists[query] as unknown as MediaQueryList)

  return mediaQueryLists
}

interface MediaQueryResult {
  isLargeDesktop: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

// Helper function for expectation
export const expectMediaResult = (
  result: { current: MediaQueryResult },
  expected: boolean[]
) => {
  expect(result.current).toEqual({
    isLargeDesktop: expected[0],
    isDesktop: expected[1],
    isTablet: expected[2],
    isMobile: expected[3],
  })
}