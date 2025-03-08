import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTodoStore } from '@store'
import { TodoFilter } from '.'

// Mocking Zustand store
jest.mock('@store', () => ({
  useTodoStore: jest.fn(),
}))

// Constants for reusable values
const ALL_BUTTON_TEXT = /all/i
const ACTIVE_BUTTON_TEXT = /active/i
const COMPLETED_BUTTON_TEXT = /completed/i

describe('TodoFilter', () => {
  const mockSetFilterOption = jest.fn()
  let user: ReturnType<typeof userEvent.setup>

  // Helper function to render component with specific filterOption
  const renderWithFilterOption = (filterOption: 'all' | 'active' | 'completed') => {
    (useTodoStore as unknown as jest.Mock).mockReturnValue({
      filterOption,
      setFilterOption: mockSetFilterOption,
    })
    
    render(<TodoFilter />)
    
    return {
      allButton: screen.getByText(ALL_BUTTON_TEXT),
      activeButton: screen.getByText(ACTIVE_BUTTON_TEXT),
      completedButton: screen.getByText(COMPLETED_BUTTON_TEXT),
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    user = userEvent.setup()
  })

  test('renders correctly with three filter buttons', () => {
    const { allButton, activeButton, completedButton } = renderWithFilterOption('all')
    
    expect(allButton).toBeInTheDocument()
    expect(activeButton).toBeInTheDocument()
    expect(completedButton).toBeInTheDocument()

    // Check if container div with the appropriate class exists
    const containerDiv = document.querySelector('.todo-filter')
    expect(containerDiv).toBeInTheDocument()
  })

  describe('Initial state tests', () => {
    test('filterOption is "all", the "All" button should be disabled and active',
      () => {
        const { allButton, activeButton, completedButton } = renderWithFilterOption('all')
        
        expect(allButton).toBeDisabled()
        expect(activeButton).not.toBeDisabled()
        expect(completedButton).not.toBeDisabled()

        expect(allButton.closest('button')).toHaveAttribute('disabled')
        expect(activeButton.closest('button')).not.toHaveAttribute('disabled')
        expect(completedButton.closest('button')).not.toHaveAttribute('disabled')
      }
    )

    test('filterOption is "active", the "Active" button should be disabled and active',
      () => {
        const { allButton, activeButton, completedButton } = renderWithFilterOption('active')
        
        expect(allButton).not.toBeDisabled()
        expect(activeButton).toBeDisabled()
        expect(completedButton).not.toBeDisabled()

        expect(allButton.closest('button')).not.toHaveAttribute('disabled')
        expect(activeButton.closest('button')).toHaveAttribute('disabled')
        expect(completedButton.closest('button')).not.toHaveAttribute('disabled')
      }
    )

    test('filterOption is "completed", the "Completed" button should be disabled and active',
      () => {
        const { allButton, activeButton, completedButton } = renderWithFilterOption('completed')

        expect(completedButton).toBeDisabled()
        expect(allButton).not.toBeDisabled()
        expect(activeButton).not.toBeDisabled()

        expect(completedButton.closest('button')).toHaveAttribute('disabled')
        expect(allButton.closest('button')).not.toHaveAttribute('disabled')
        expect(activeButton.closest('button')).not.toHaveAttribute('disabled')
      }
    )
  })

  describe('Filter change tests', () => {
    test('clicking "All" when selected option is "active" sets filter to "all"',
      async () => {
        const { allButton } = renderWithFilterOption('active')
        await user.click(allButton)
        expect(mockSetFilterOption).toHaveBeenCalledTimes(1)
        expect(mockSetFilterOption).toHaveBeenCalledWith('all')
      }
    )

    test('clicking "Active" when selected option is "all" sets filter to "active"',
      async () => {
        const { activeButton } = renderWithFilterOption('all')
        await user.click(activeButton)
        expect(mockSetFilterOption).toHaveBeenCalledTimes(1)
        expect(mockSetFilterOption).toHaveBeenCalledWith('active')
      }
    )

    test('clicking "Completed" when selected option is "all" sets filter to "completed"',
      async () => {
        const { completedButton } = renderWithFilterOption('all')
        await user.click(completedButton)
        expect(mockSetFilterOption).toHaveBeenCalledTimes(1)
        expect(mockSetFilterOption).toHaveBeenCalledWith('completed')
      }
    )
  })

  describe('Disabled button tests', () => {
    test('clicking "All" when it is already selected should not call setFilterOption',
      async () => {
        const { allButton } = renderWithFilterOption('all')
        await user.click(allButton)
        expect(mockSetFilterOption).not.toHaveBeenCalled()
      }
    )

    test('clicking "Active" when it is already selected should not call setFilterOption',
      async () => {
        const { activeButton } = renderWithFilterOption('active')
        await user.click(activeButton)
        expect(mockSetFilterOption).not.toHaveBeenCalled()
      }
    )

    test('clicking "Completed" when it is already selected should not call setFilterOption',
      async () => {
        const { completedButton } = renderWithFilterOption('completed')
        await user.click(completedButton)
        expect(mockSetFilterOption).not.toHaveBeenCalled()
      }
    )
  })
})