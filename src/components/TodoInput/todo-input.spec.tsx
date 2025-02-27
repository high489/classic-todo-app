import { render, screen } from '@testing-library/react'
import { TodoInput } from '.'

describe('TodoInput renders', () => {
  test("TodoInput renders correctly", () => {
    render(<TodoInput />)

    expect(screen.getByPlaceholderText(/What needs to be done?/i)).toBeInTheDocument()
  })
})