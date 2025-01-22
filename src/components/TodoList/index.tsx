import styles from './todo-list.module.scss'
import { FC } from 'react'

import { useTodoStore } from '@store'
import { TodoItem } from './TodoItem'

interface TodoListProps {}

const TodoList: FC<TodoListProps> = () => {
  const { todos } = useTodoStore()
  
  return (
    <>
      <ul className={styles['todo-list']}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo}/>
        ))}
      </ul>
    </>
  )
}

export { TodoList }