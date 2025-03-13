import { StateCreator } from 'zustand'

import { Todo } from '@models'

export interface TodoSlice {
  todos: Todo[];
  getSortedTodos: () => Todo[]; 
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  deleteCompletedTodos: () => void;
}

export const createTodoSlice: StateCreator<TodoSlice> = (set, get) => ({
  todos: [],
  getSortedTodos: () => {
    return get().todos
                .sort((a, b) => Number(a.id) - Number(b.id))
                .reverse()
                //.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
  },
  addTodo: (text) => {
    const newTodo = { id: Date.now().toString(), text, isCompleted: false }
    set({ todos: [...get().todos, newTodo] })
  },
  toggleTodo: (id) => set({
    todos: get().todos.map(todo => 
      id === todo.id
      ? { ...todo, isCompleted: !todo.isCompleted }
      : todo
    )
  }),
  deleteTodo: (id) => set({
    todos: get().todos.filter(todo => todo.id !== id)
  }),
  deleteCompletedTodos: () => set({
    todos: get().todos.filter(todo => !todo.isCompleted)
  })
})