// Mock functions to avoid actual DOM manipulation
export const mockSetProperty = jest.fn()
export const mockAddEventListener = jest.fn()
export const mockRemoveEventListener = jest.fn()

// Interface for configuration options
export interface MockElementsConfig {
  listScrollHeight?: number
  listClientHeight?: number
  listScrollTop?: number
  scrollbarHeight?: number
  thumbHeight?: number
  isEmpty?: boolean
  hasChildren?: boolean
}

// Interface for the mock HTML element
export interface MockHTMLElement {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  children: any[]
  addEventListener: jest.Mock
  removeEventListener: jest.Mock
  style?: any
  parentElement?: any
}

// Helper function to create mock elements and references
export const createMockElements = (config: MockElementsConfig = {}) => {
  const {
    listScrollHeight = 1000,
    listClientHeight = 400,
    listScrollTop = 0,
    scrollbarHeight = 400,
    thumbHeight = 100,
    isEmpty = false,
    hasChildren = true,
  } = config

  // Create mock list element
  const mockListElement: MockHTMLElement = {
    scrollTop: listScrollTop,
    scrollHeight: listScrollHeight,
    clientHeight: listClientHeight,
    children: hasChildren ? Array(10).fill({}) : [],
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  }

  // Create mock thumb element
  const mockThumbElement = {
    clientHeight: thumbHeight,
    style: { height: '0px', transform: '', setProperty: mockSetProperty },
    parentElement: { clientHeight: scrollbarHeight, style: { height: '0px' } },
  }

  // Create refs
  const listRef = { current: isEmpty ? null : mockListElement } as React.RefObject<HTMLElement>
  const scrollbarThumbRef = { current: isEmpty ? null : mockThumbElement } as React.RefObject<HTMLElement>

  return { listRef, scrollbarThumbRef, mockListElement, mockThumbElement, mockSetProperty }
}

// Attaches a mock scrollbar thumb ref to the hook's internal ref for testing purposes
export const attachThumbRef = (
  hookResult: { scrollbarThumbRef: React.RefObject<HTMLElement> },
  mockThumbRef: React.RefObject<HTMLElement>
) => {
  const internalScrollbarThumbRef = hookResult.scrollbarThumbRef
  Object.defineProperty(internalScrollbarThumbRef, 'current', {
    value: mockThumbRef.current,
    writable: true,
  })
}

// Triggers a scrollbar update by rerendering the hook and simulating resize behavior.
export const triggerScrollbarUpdate = (
  listRef: React.RefObject<HTMLElement>,
  scrollbarThumbRef: React.RefObject<HTMLElement>,
  hasScrollbar: boolean,
  rerender: (props: { ref: React.RefObject<HTMLElement>; hasScrollbar: boolean }) => void,
  actFn: (fn: () => void) => void
) => {
  actFn(() => {
    rerender({ ref: listRef, hasScrollbar })

    const resizeObserverCallback = mockAddEventListener.mock.calls.find(
      (call) => call[0] === 'resize'
    )?.[1]
    if (resizeObserverCallback) {
      resizeObserverCallback()
    } else {
      const updateScrollbar = () => {
        const list = listRef.current!
        const thumb = scrollbarThumbRef.current!
        const visibleRatio = list.clientHeight / list.scrollHeight
        const thumbHeight = Math.max(visibleRatio * list.clientHeight, 20)
        thumb.style.height = `${thumbHeight}px`
        if (hasScrollbar && list.scrollHeight > list.clientHeight) {
          thumb.parentElement!.style.height = `${list.clientHeight}px`
        } else {
          thumb.parentElement!.style.height = '0px'
        }
      }
      updateScrollbar()
    }
  })
}

// Mock MutationObserver and ResizeObserver globally
export const setupMutationObserverMocks = () => {
  global.MutationObserver = class {
    constructor(callback: MutationCallback) {
      this.callback = callback
    }
    private callback: MutationCallback;
    observe() {}
    disconnect() {}
    trigger(changes: MutationRecord[]) {
      this.callback(changes, this as any)
    }
  } as any
}

// Mock ResizeObserver globally
export const setupResizeObserverMocks = () => {
  global.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    private callback: ResizeObserverCallback
    observe() {}
    unobserve() {}
    disconnect() {}
    trigger(entries: ResizeObserverEntry[]) {
      this.callback(entries, this as any)
    }
  } as any
}