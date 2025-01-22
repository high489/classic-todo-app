import { StateCreator } from 'zustand'

import { Todo } from '@models'

export interface TodoSlice {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
}

export const createTodoSlice: StateCreator<TodoSlice> = (set) => ({
  todos: [],
  addTodo: (text) => {
    set((state) => ({
      todos: [
        ...state.todos,
        { id: Date.now().toString(), text, isCompleted: false },
      ],
    }));
  },
  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      ),
    }));
  },
})