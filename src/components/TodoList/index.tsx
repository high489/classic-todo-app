import styles from './todo-list.module.scss'
import { FC } from 'react'

import { useTodoStore } from '@store'
import { TodoItem } from './TodoItem'

interface TodoListProps {}

const TodoList: FC<TodoListProps> = () => {
  const { getSortedTodos, filterOption } = useTodoStore()
  const todos = getSortedTodos()
  const filteredTodos = todos.filter((todo) => {
    switch (filterOption) {
      case 'active': return !todo.isCompleted
      case 'completed': return todo.isCompleted
      default: return todo
    }
  })

  return (
    <>
      <ul className={styles['todo-list']}>
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo}/>
        ))}
      </ul>
    </>
  )
}

export { TodoList }