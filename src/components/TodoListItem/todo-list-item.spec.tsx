import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoListItem } from '.'

// Mock the SVG component
jest.mock(
  '@assets/icons/delete-todo-icon.svg?react', 
  () => () => <div data-testid="delete-icon" />,
)

// Mock the CustomCheckbox component
jest.mock('@ui', () => ({
  CustomCheckbox: ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <input 
      type="checkbox" 
      data-testid="custom-checkbox" 
      checked={checked} 
      onChange={onChange} 
    />
  )
}))

describe('TodoListItem', () => {
  // Test data
  const mockTodo = {
    id: '1',
    text: 'Test Todo',
    isCompleted: false
  }

  const mockCompletedTodo = {
    id: '2',
    text: 'Completed Todo',
    isCompleted: true
  }

  const mockLongTextTodo = {
    id: '3',
    text: 'This is a very long todo text that should be truncated when displayed in the component as it exceeds the maximum number of lines allowed for display',
    isCompleted: false
  }

  const mockSpecialCharsTodo = {
    id: '4',
    text: 'Special chars: !@#$%^&*()_+',
    isCompleted: false
  }

  // Mock functions
  const mockToggleTodo = jest.fn()
  const mockDeleteTodo = jest.fn()

  // Setup user event
  let user: ReturnType<typeof userEvent.setup>

  // Helper function for rendering the component
  const renderTodoListItem = (todo = mockTodo, height?: string) => {
    return render(
      <TodoListItem 
        todo={todo} 
        toggleTodo={mockToggleTodo} 
        deleteTodo={mockDeleteTodo}
        height={height} 
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    user = userEvent.setup()
  })

  test('renders correctly with default props', () => {
    renderTodoListItem()

    // Verify all elements are present
    expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument()
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
    
    // Verify checkbox state matches todo state
    expect(screen.getByTestId('custom-checkbox')).not.toBeChecked()
    
    // Verify default height
    const todoItem = screen.getByRole('listitem')
    expect(todoItem).toHaveStyle({ height: '88px' })
  })

  test('renders with custom height when provided', () => {
    renderTodoListItem(mockTodo, '100px')

    const todoItem = screen.getByRole('listitem')
    expect(todoItem).toHaveStyle({ height: '100px' })
  })

  test('renders completed todo with completed class', () => {
    renderTodoListItem(mockCompletedTodo)

    // Verify checkbox is checked
    expect(screen.getByTestId('custom-checkbox')).toBeChecked()
    
    // Verify text has completed class (we'll check for the content)
    const textElement = screen.getByText('Completed Todo')
    expect(textElement.closest('span.text')).toHaveClass('completed')
  })

  test('renders uncompleted todo without completed class', () => {
    renderTodoListItem(mockTodo)
    
    const textElement = screen.getByText('Test Todo')
    expect(textElement.closest('span.text')).not.toHaveClass('completed')
  })

  test('calls toggleTodo when checkbox is clicked', async () => {
    renderTodoListItem()

    await user.click(screen.getByTestId('custom-checkbox'))
    
    expect(mockToggleTodo).toHaveBeenCalledTimes(1)
    expect(mockToggleTodo).toHaveBeenCalledWith(mockTodo.id)
  })

  test('calls deleteTodo when delete button is clicked', async () => {
    renderTodoListItem()

    // Find the delete button (container of the icon)
    const deleteButton = screen.getByTestId('delete-icon').closest('button')
    expect(deleteButton).toBeInTheDocument()
    
    await user.click(deleteButton!)
    
    expect(mockDeleteTodo).toHaveBeenCalledTimes(1)
    expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id)
  })

  test('renders correctly with long text', () => {
    renderTodoListItem(mockLongTextTodo)
    
    // Verify the text content is displayed (even though it will be truncated visually by CSS)
    expect(screen.getByText(mockLongTextTodo.text)).toBeInTheDocument()
    
    // We can only verify that the text is contained in the correct element structure
    // The actual truncation is handled by CSS which is not testable directly in unit tests
    const textElement = screen.getByText(mockLongTextTodo.text)
    expect(textElement.closest('span.text')).toBeInTheDocument()
  })

  test('renders correctly with special characters in text', () => {
    renderTodoListItem(mockSpecialCharsTodo)
    
    expect(screen.getByText(mockSpecialCharsTodo.text)).toBeInTheDocument()
  })

  test('toggles completed status correctly for both completed and uncompleted todos', async () => {
    // Test with uncompleted todo
    const { rerender } = renderTodoListItem(mockTodo)
    
    await user.click(screen.getByTestId('custom-checkbox'))
    expect(mockToggleTodo).toHaveBeenCalledWith(mockTodo.id)
    
    // Reset and test with completed todo
    jest.clearAllMocks()
    
    rerender(
      <TodoListItem 
        todo={mockCompletedTodo} 
        toggleTodo={mockToggleTodo} 
        deleteTodo={mockDeleteTodo} 
      />
    )
    
    await user.click(screen.getByTestId('custom-checkbox'))
    expect(mockToggleTodo).toHaveBeenCalledWith(mockCompletedTodo.id)
  })
})