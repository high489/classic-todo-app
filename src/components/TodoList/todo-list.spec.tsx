import { render, screen, waitFor } from '@testing-library/react'
import { Todo } from '@models'
import { useTodoStore } from '@store'
import { useMatchMedia, useScrollbar } from '@hooks'
import { TodoList } from '.'

// Mocking Zustand store
jest.mock('@store', () => ({
  useTodoStore: jest.fn(),
}))

// Mocking custom hooks
jest.mock('@hooks', () => ({
  useMatchMedia: jest.fn(),
  useScrollbar: jest.fn(),
}))

// Mocking TodoListItem
jest.mock('@components', () => ({
  TodoListItem: ({ todo, height }: { todo: Todo; height: string }) => (
    <li data-testid='todo-item' data-todo-id={todo.id} style={{ height }}>
      {todo.text}
    </li>
  ),
}))

// Mocking CSS modules
jest.mock('./todo-list.module.scss', () => ({
  'todo-list-wrapper': 'todo-list-wrapper',
  'todo-list': 'todo-list',
  'scrollbar': 'scrollbar',
  'scrollbar-thumb': 'scrollbar-thumb',
}))

describe('TodoList', () => {
  const mockGetSortedTodos = jest.fn()
  const mockUseTodoStore = useTodoStore as unknown as jest.Mock
  const mockUseMatchMedia = useMatchMedia as jest.Mock
  const mockUseScrollbar = useScrollbar as jest.Mock

  const generateTodos = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: String(i + 1),
      text: `Task ${i + 1}`,
      isCompleted: false,
    }))
  }

  const mockMediaConfig = (
    isMobile: boolean,
    isTablet: boolean,
    isDesktop: boolean,
    isLargeDesktop: boolean
  ) => {
    mockUseMatchMedia.mockReturnValue({
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
    })
  }

  const defaultScrollbarMock = {
    scrollbarThumbRef: { current: null },
    handleScrollMouseDown: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = () => render(<TodoList />)

  describe('Integration with useTodoStore', () => {
    test('calls getSortedTodos from the store', async () => {
      mockGetSortedTodos.mockReturnValue(generateTodos(3))
        mockUseTodoStore.mockReturnValue({
          getSortedTodos: mockGetSortedTodos,
          filterOption: 'all',
        })
        mockMediaConfig(false, false, true, false)
        mockUseScrollbar.mockReturnValue(defaultScrollbarMock)

        renderComponent()

        await waitFor(() => expect(mockGetSortedTodos).toHaveBeenCalled())
    })
  })

  describe('Rendering without tasks', () => {
    test('renders empty list and no scrollbar when todos is empty', async () => {
      mockGetSortedTodos.mockReturnValue([])
      mockUseTodoStore.mockReturnValue({
        getSortedTodos: mockGetSortedTodos,
        filterOption: 'all',
      })
      // Use isDesktop to apply standard config (visibleTodos: 4, todoHeight: 88)
      mockUseMatchMedia.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
      })
      mockUseScrollbar.mockReturnValue(defaultScrollbarMock)

      const { container } = renderComponent()

      await waitFor(() => expect(container.querySelector('.todo-list-wrapper')).toBeInTheDocument())

      // No TodoListItem rendered
      expect(screen.queryAllByTestId('todo-item')).toHaveLength(0)

      // Scrollbar should not be rendered since there are no tasks
      expect(container.querySelector('.scrollbar')).not.toBeInTheDocument()
    })
  })

  describe('Filtering todos', () => {
    const todos = [
      { id: '1', text: 'Task 1', isCompleted: false },
      { id: '2', text: 'Task 2', isCompleted: true },
      { id: '3', text: 'Task 3', isCompleted: false },
    ]

    const setupFilterTest = (filterOption: 'all' | 'active' | 'completed') => {
      mockGetSortedTodos.mockReturnValue(todos)
      mockUseTodoStore.mockReturnValue({
        getSortedTodos: mockGetSortedTodos,
        filterOption,
      })
      mockUseMatchMedia.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
      })
      mockUseScrollbar.mockReturnValue(defaultScrollbarMock)
      renderComponent()
    }
  
    test('renders all todos when filterOption is "all"', async () => {
      setupFilterTest('all')
      await waitFor(() => expect(screen.getAllByTestId('todo-item').length).toBe(3))
    })
  
    test('renders only active todos when filterOption is "active"', async () => {
      setupFilterTest('active')
      // Active todos: Task 1 и Task 3
      await waitFor(() => expect(screen.getAllByTestId('todo-item').length).toBe(2))
    })
  
    test('renders only completed todos when filterOption is "completed"', async () => {
      setupFilterTest('completed')
      // Completed todos: only Task 2
      await waitFor(() => expect(screen.getAllByTestId('todo-item').length).toBe(1))
    })
  })

  describe('Container height calculation based on media queries', () => {
    beforeEach(() => {
      mockUseScrollbar.mockReturnValue(defaultScrollbarMock)
      mockUseTodoStore.mockReturnValue({
        getSortedTodos: mockGetSortedTodos,
        filterOption: 'all',
      })
    })
  
    test('calculates height correctly for mobile screen size', () => {
      mockMediaConfig(true, false, false, false) // max-width: 480px
  
      const { container } = renderComponent()
  
      expect(container.querySelector('.todo-list-wrapper')).toHaveStyle({
        height: `${6 * 55}px`, // visibleTodos: 6, todoHeight: 55
      })
    })

    test('calculates height correctly for tablet screen size', () => {
      mockMediaConfig(false, true, false, false) // max-width: 768px
  
      const { container } = renderComponent()
  
      expect(container.querySelector('.todo-list-wrapper')).toHaveStyle({
        height: `${6 * 72}px`, // visibleTodos: 6, todoHeight: 72
      })
    })

    test('calculates height correctly for desktop screen size', () => {
      mockMediaConfig(false, false, true, false) // max-width: 1024px
  
      const { container } = renderComponent()
  
      expect(container.querySelector('.todo-list-wrapper')).toHaveStyle({
        height: `${4 * 88}px`, // visibleTodos: 4, todoHeight: 88
      })
    })
  
    test('calculates height correctly for large desktop', () => {
      mockMediaConfig(false, false, false, true) // min-width: 1025px
  
      const { container } = renderComponent()
  
      expect(container.querySelector('.todo-list-wrapper')).toHaveStyle({
        height: `${4 * 88}px`, // visibleTodos: 4, todoHeight: 88
      })
    })
  })

  describe('Custom scrollbar visibility', () => {
    // isDesktop: true, visibleTodos: 4, todos length: 5, result: scrollbar shown
    test('displays scrollbar when isDesktop and todos length > visibleTodos',
      async () => {
        mockGetSortedTodos.mockReturnValue(generateTodos(5))
        mockUseTodoStore.mockReturnValue({
          getSortedTodos: mockGetSortedTodos,
          filterOption: 'all',
        })
        mockMediaConfig(false, false, true, false)
        mockUseScrollbar.mockReturnValue(defaultScrollbarMock)
    
        const { container } = renderComponent()
    
        await waitFor(() => expect(container.querySelector('.scrollbar')).toBeInTheDocument())
      }
    )

    // isDesktop: true, visibleTodos: 4, todos length: 4, result: scrollbar hidden
    test('does not display scrollbar when isDesktop and todos length <= visibleTodos',
      async () => {
        mockGetSortedTodos.mockReturnValue(generateTodos(4))
        mockUseTodoStore.mockReturnValue({
          getSortedTodos: mockGetSortedTodos,
          filterOption: 'all',
        })
        mockMediaConfig(false, false, true, false)
        mockUseScrollbar.mockReturnValue(defaultScrollbarMock)

        const { container } = renderComponent()

        await waitFor(() => expect(container.querySelector('.scrollbar')).not.toBeInTheDocument())
      }
    )

    // isMobile: true, visibleTodos: 6, todos length: 10, result: scrollbar hidden
    test('does not display scrollbar when isMobile regardless of todos length',
      async () => {
        mockGetSortedTodos.mockReturnValue(generateTodos(10))
        mockUseTodoStore.mockReturnValue({
          getSortedTodos: mockGetSortedTodos,
          filterOption: 'all',
        })
        mockMediaConfig(true, false, false, false)
        mockUseScrollbar.mockReturnValue(defaultScrollbarMock)

        const { container } = renderComponent()

        await waitFor(() => expect(container.querySelector('.scrollbar')).not.toBeInTheDocument())
      }
    )

    // isTablet: true, visibleTodos: 6, todos length: 10, result: scrollbar hidden
    test('does not display scrollbar when isTablet regardless of todos length',
      async () => {
        mockGetSortedTodos.mockReturnValue(generateTodos(10))
        mockUseTodoStore.mockReturnValue({
          getSortedTodos: mockGetSortedTodos,
          filterOption: 'all',
        })
        mockMediaConfig(false, true, false, false)
        mockUseScrollbar.mockReturnValue(defaultScrollbarMock)

        const { container } = renderComponent()

        await waitFor(() => expect(container.querySelector('.scrollbar')).not.toBeInTheDocument())
      }
    )
  })
  
})