import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import {
  TodoSlice,
  createTodoSlice,
  FilterSlice,
  createFilterSlice
} from '@store/slices'

export const useTodoStore = create(
  devtools(
    persist<TodoSlice & FilterSlice>(
      (...args) => ({
        ...createTodoSlice(...args),
        ...createFilterSlice(...args),
      }),
      {
        name: 'todo-store',
      }
    )
  )
)