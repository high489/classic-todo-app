import { renderHook, act } from '@testing-library/react'
import { useScrollbar } from '.'
import {
  mockAddEventListener,
  mockRemoveEventListener,
  createMockElements,
  attachThumbRef,
  triggerScrollbarUpdate,
  setupMutationObserverMocks,
  setupResizeObserverMocks,
} from './test.setup'

beforeAll(() => {
  setupMutationObserverMocks()
  setupResizeObserverMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(document, 'addEventListener', { value: mockAddEventListener, configurable: true })
  Object.defineProperty(document, 'removeEventListener', { value: mockRemoveEventListener, configurable: true })
})

describe('useScrollbar', () => {
  // Test 1: Hook initialization
  test('initializes with the correct return values', () => {
    const { listRef } = createMockElements()
    const { result } = renderHook(() => useScrollbar(listRef, true))

    expect(result.current).toHaveProperty('scrollbarThumbRef')
    expect(result.current).toHaveProperty('handleScrollMouseDown')
    expect(typeof result.current.handleScrollMouseDown).toBe('function')
  })

  // Test 2: Scrollbar thumb position updates when content is scrolled
  test('updates scrollbar thumb position when content is scrolled', () => {
    const { listRef, scrollbarThumbRef } = createMockElements({
      listScrollHeight: 1000,
      listClientHeight: 400,
      scrollbarHeight: 400,
      thumbHeight: 160, // 40% visible ratio = 400/1000
    })

    const { result } = renderHook(() => useScrollbar(listRef, true))
    attachThumbRef(result.current, scrollbarThumbRef)

    // simulate scroll event
    act(() => {
      // set scroll position to 25% of scrollable area
      if (listRef.current) listRef.current.scrollTop = 150 // (1000 - 400) * 0.25

      // call the scroll handler directly
      const scrollHandler = mockAddEventListener.mock.calls
        .find((call) =>call[0] === 'scroll')?.[1]

      if (scrollHandler) scrollHandler()
    })

    // Assert: Check transform property was set correctly
    // Max thumb position = 400 - 160 = 240
    // Expected thumb position = 150 / (1000 - 400) * 240 = 60
    expect(scrollbarThumbRef.current?.style.transform).toContain('translateY(60px)')
  })

  // Test 3: Scrollbar thumb size changes when content size changes
  test('recalculates scrollbar thumb size when content size changes', () => {
    const { listRef, scrollbarThumbRef } = createMockElements({
      listScrollHeight: 1000,
      listClientHeight: 400,
    })

    const { result, rerender } = renderHook(
      ({ ref, hasScrollbar }) => useScrollbar(ref, hasScrollbar),
      { initialProps: { ref: listRef, hasScrollbar: true } }
    )
    attachThumbRef(result.current, scrollbarThumbRef)

    triggerScrollbarUpdate(listRef, scrollbarThumbRef, true, rerender, act)

    act(() => {
      if (listRef.current) {
        Object.defineProperty(
          listRef.current, 'scrollHeight', { value: 2000, configurable: true }
        )
      }
      triggerScrollbarUpdate(listRef, scrollbarThumbRef, true, rerender, act)
    })

    expect(scrollbarThumbRef.current?.style.height).toBe('80px')
  })

  // Test 4: Scrollbar visibility based on hasScrollbar parameter
  test('respects hasScrollbar parameter for calculations and updates', () => {
    const { listRef, scrollbarThumbRef } = createMockElements({
      listScrollHeight: 1000,
      listClientHeight: 400,
    })

    const { result, rerender } = renderHook(
      ({ ref, hasScrollbar }) => useScrollbar(ref, hasScrollbar),
      { initialProps: { ref: listRef, hasScrollbar: false } }
    )
    attachThumbRef(result.current, scrollbarThumbRef)

    triggerScrollbarUpdate(listRef, scrollbarThumbRef, false, rerender, act)
    expect(scrollbarThumbRef.current?.parentElement?.style.height).toBe('0px')

    act(() => {
      rerender({ ref: listRef, hasScrollbar: true })
      triggerScrollbarUpdate(listRef, scrollbarThumbRef, true, rerender, act)
    })
    expect(scrollbarThumbRef.current?.parentElement?.style.height).toBe('400px')
  })

  // Test 5: Dragging scrollbar thumb
  test('allows dragging of the scrollbar thumb to scroll content', () => {
    const { listRef, scrollbarThumbRef } = createMockElements({
      listScrollHeight: 1000,
      listClientHeight: 400,
      scrollbarHeight: 400,
      thumbHeight: 160,
    })

    const { result } = renderHook(() => useScrollbar(listRef, true))
    attachThumbRef(result.current, scrollbarThumbRef)

    const mouseDownEvent = {
      clientY: 50, preventDefault: jest.fn() 
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleScrollMouseDown(mouseDownEvent)
    })

    const mouseMoveHandler = mockAddEventListener.mock.calls
      .find((call) => call[0] === 'mousemove')?.[1]

    act(() => { mouseMoveHandler({ clientY: 100 }) })

    expect(listRef.current?.scrollTop).toBeCloseTo(75, 0)

    const mouseUpHandler = mockAddEventListener.mock.calls
      .find((call) => call[0] === 'mouseup')?.[1]
    act(() => {
      mouseUpHandler()
    })

    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })

  // Test 6: Parametrized tests for different conditions
  describe.each([
    ['empty list with hasScrollbar=true', { isEmpty: true, hasScrollbar: true }, false],
    ['content height <= container height with hasScrollbar=true', { listScrollHeight: 400, listClientHeight: 400, hasScrollbar: true, isEmpty: false }, false],
    ['content height > container height with hasScrollbar=true', { listScrollHeight: 1000, listClientHeight: 400, hasScrollbar: true, isEmpty: false }, true],
    ['content height > container height with hasScrollbar=false', { listScrollHeight: 1000, listClientHeight: 400, hasScrollbar: false, isEmpty: false }, false],
  ])('with %s', (testName, config, shouldDisplay) => {
    test(`${testName} ${shouldDisplay ? 'displays' : 'does not display'} scrollbar correctly`, () => {
      const { listRef, scrollbarThumbRef } = createMockElements(config)
      const { result, rerender } = renderHook(
        ({ ref, hasScrollbar }) => useScrollbar(ref, hasScrollbar),
        { initialProps: { ref: listRef, hasScrollbar: config.hasScrollbar } }
      )

      if (!config.isEmpty) {
        attachThumbRef(result.current, scrollbarThumbRef)
        triggerScrollbarUpdate(listRef, scrollbarThumbRef, config.hasScrollbar, rerender, act)

        if (shouldDisplay) {
          expect(scrollbarThumbRef.current?.parentElement?.style.height).toBe('400px')
          expect(scrollbarThumbRef.current?.style.height).not.toBe('0px')
        } else {
          expect(scrollbarThumbRef.current?.parentElement?.style.height).toBe('0px')
        }
      }
    })
  })

  // Test 7: Event handlers and cleanup
  test('adds and removes event listeners correctly', () => {
    const { listRef } = createMockElements()
    const { unmount } = renderHook(() => useScrollbar(listRef, true))

    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    unmount()
    expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})