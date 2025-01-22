import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { TodoSlice, createTodoSlice } from '@store/slices'

export const useTodoStore = create(
  devtools(
    persist<TodoSlice>(
      (...args) => ({
        ...createTodoSlice(...args),
      }),
      {
        name: 'todo-store',
      }
    )
  )
)