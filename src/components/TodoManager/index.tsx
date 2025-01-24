import styles from './todo-manager.module.scss'
import { FC } from 'react'

import { TodoControls, TodoInput, TodoList } from '@components'

interface TodoManagerProps {}

const TodoManager: FC<TodoManagerProps> = () => {
  return (
    <>
      <div className={styles['todo-manager']}>
        <TodoInput />
        <div className={styles['todo-list-controls-wrapper']}>
          <TodoList />
          <TodoControls />
        </div>
      </div>
    </>
  )
}

export { TodoManager }