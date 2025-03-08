import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTodoStore } from '@store'
import { TodoControls } from '.'
import { Todo } from '@models'

// Mocking Zustand store
jest.mock('@store', () => ({
  useTodoStore: jest.fn(),
}))

// Mock the SVG component
jest.mock(
  '@assets/icons/clear-completed-icon.svg?react', 
  () => () => <div data-testid='clear-completed-icon' />,
)

// Mock TodoFilter component
jest.mock('@components/TodoFilter', () => ({
  __esModule: true,
  TodoFilter: () => <div data-testid="mocked-todo-filter" />,
}))

const CLEAR_COMPLETED_TEXT = /clear completed/i

describe('TodoControls', () => {
  const mockDeleteCompletedTodos = jest.fn()
  let user: ReturnType<typeof userEvent.setup>

  const renderComponent = (todos: Todo[] = []) => {
    (useTodoStore as unknown as jest.Mock).mockReturnValue({
      todos,
      deleteCompletedTodos: mockDeleteCompletedTodos,
    })
    render(<TodoControls />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    user = userEvent.setup()
  })

  test('renders all elements correctly', () => {
    renderComponent([])

    expect(screen.getByText(/\bitems\b.*\bleft\b/i)).toBeInTheDocument()
    expect(screen.getByTestId('mocked-todo-filter')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: CLEAR_COMPLETED_TEXT })).toBeInTheDocument()
  })

  describe('Element with amount items left tests', () => {
    test('displays correct text for 0 incomplete todos', () => {
      renderComponent([
        { id: '1', text: 'Task 1', isCompleted: true },
        { id: '2', text: 'Task 2', isCompleted: true },
      ])
      expect(screen.getByText(/0 items left/i)).toBeInTheDocument()
    })
  
    test('displays correct text for 1 incomplete todo', () => {
      renderComponent([
        { id: '1', text: 'Task 1', isCompleted: false },
        { id: '2', text: 'Task 2', isCompleted: true },
      ])
      expect(screen.getByText(/1 item left/i)).toBeInTheDocument()
    })
  
    test('displays correct text for multiple incomplete todos', () => {
      renderComponent([
        { id: '1', text: 'Task 1', isCompleted: false },
        { id: '2', text: 'Task 2', isCompleted: false },
        { id: '3', text: 'Task 3', isCompleted: true },
      ])
      expect(screen.getByText(/2 items left/i)).toBeInTheDocument()
    })
  })

  describe('"Clear Completed" button tests', () => {
    test('clear-button is disabled when todos list is empty', () => {
      renderComponent([])
      expect(screen.getByRole('button', { name: CLEAR_COMPLETED_TEXT })).toBeDisabled()
    })
  
    test('clear-button is enabled when todos list is not empty', () => {
      renderComponent([{ id: '1', text: 'Task 1', isCompleted: false }])
      expect(screen.getByRole('button', { name: CLEAR_COMPLETED_TEXT })).toBeEnabled()
    })
  
    test('clear-button displays SVG icon and text', () => {
      renderComponent([{ id: '1', text: 'Task 1', isCompleted: false }])
      expect(screen.getByTestId('clear-completed-icon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: CLEAR_COMPLETED_TEXT })).toBeInTheDocument()
    })
  
    test('clicking clear-button calls deleteCompletedTodos', async () => {
      renderComponent([
        { id: '1', text: 'Task 1', isCompleted: false },
        { id: '2', text: 'Task 2', isCompleted: true }
      ])
      await user.click(screen.getByText(CLEAR_COMPLETED_TEXT))
      expect(mockDeleteCompletedTodos).toHaveBeenCalledTimes(1)
    })
  })
})