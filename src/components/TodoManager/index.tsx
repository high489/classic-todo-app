import styles from './todo-manager.module.scss'
import { FC } from 'react'

import { TodoControls, TodoInput, TodoList } from '@components'

interface TodoManagerProps {}

const TodoManager: FC<TodoManagerProps> = () => {
  return (
    <>
      <div className={styles['todo-manager']}>
        <TodoInput />
        <TodoList />
        <TodoControls />
      </div>
    </>
  )
}

export { TodoManager }