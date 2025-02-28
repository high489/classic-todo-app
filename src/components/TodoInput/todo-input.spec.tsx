import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTodoStore } from '@store'
import { TodoInput } from '.'

// Mocking Zustand store
jest.mock('@store', () => ({
  useTodoStore: jest.fn(),
}))

// Constants for reusable values
const PLACEHOLDER_TEXT = /What needs to be done?/i
const ADD_BUTTON_TEXT = /add/i

describe('TodoInput', () => {
  const mockAddTodo = jest.fn()
  let user: ReturnType<typeof userEvent.setup>
  let input: HTMLElement
  let addButton: HTMLElement

  // General setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useTodoStore as unknown as jest.Mock).mockReturnValue({
      addTodo: mockAddTodo,
    })
    user = userEvent.setup()
    render(<TodoInput />)
    input = screen.getByPlaceholderText(PLACEHOLDER_TEXT)
    addButton = screen.getByText(ADD_BUTTON_TEXT)
  })

  // Helper function to check if a task was added
  const expectTodoAdded = (text: string) => {
    expect(mockAddTodo).toHaveBeenCalledWith(text)
    expect(mockAddTodo).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('')
  }

  // Helper function to check if no task was added
  const expectNoTodoAdded = () => {
    expect(mockAddTodo).not.toHaveBeenCalled()
  }

  test('renders correctly with placeholder', () => {
    expect(input).toBeInTheDocument()
    expect(addButton).toBeInTheDocument()
  })

  test('adds a todo when clicking the ADD button', async () => {
    await user.type(input, 'Test Task')
    await user.click(addButton)
    expectTodoAdded('Test Task')
  })

  test('adds a todo when pressing Enter key', async () => {
    await user.type(input, 'Test Task with Enter{enter}')
    expectTodoAdded('Test Task with Enter')
  })

  test('does not add a todo with empty or whitespace input when clicking ADD', async () => {
    await user.clear(input)
    expect(input).toHaveValue('')
    await user.click(addButton)
    expectNoTodoAdded()

    await user.clear(input)
    await user.type(input, '   ')
    expect(input).toHaveValue('   ')
    await user.click(addButton)
    expectNoTodoAdded()
  })

  test('does not add a todo with empty or whitespace input when pressing Enter', async () => {
    await user.type(input, '{enter}')
    expectNoTodoAdded()

    await user.clear(input)
    await user.type(input, '   {enter}')
    expectNoTodoAdded()
  })

  test('input loses focus after pressing Enter', async () => {
    await user.type(input, 'Focus Test{enter}')
    expect(document.activeElement).not.toBe(input)
  })
})