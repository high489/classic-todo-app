import { useState, useLayoutEffect } from 'react'

const queries = [
  '(min-width: 1025px)', // large desktop
  '(min-width: 769px) and (max-width: 1024px)', // desktop
  '(min-width: 481px) and (max-width: 768px)', // tablet
  '(max-width: 480px)', // mobile
]

interface ScreenMatches {
  isLargeDesktop: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

const useMatchMedia = (): ScreenMatches => {
  if (typeof window === undefined) return {} as ScreenMatches

  const mediaQueriesLists = queries.map(query => matchMedia(query))
  const getValues = () => mediaQueriesLists.map(mql => mql.matches)
  const [values, setValues] = useState(getValues)

  useLayoutEffect(() => {
    const handler = () => setValues(getValues)
    mediaQueriesLists.forEach(mql => mql.addEventListener('change', handler))
    return () => mediaQueriesLists.forEach(mql => mql.removeEventListener('change', handler))
  })

  return ['isLargeDesktop', 'isDesktop', 'isTablet', 'isMobile'].reduce(
    (acc, screen, index) => ({
      ...acc,
      [screen]: values[index]
    }), {} as ScreenMatches
  )
}

export { useMatchMedia }