import styles from './todo-controls.module.scss'
import { FC } from 'react'

import { useTodoStore } from '@src/app/store'
import { TodoFilter } from '@components'

interface TodoControlsProps {}

const TodoControls: FC<TodoControlsProps> = () => {
  const { todos, deleteCompletedTodos } = useTodoStore()
  const itemsLeft = todos.filter(todo => !todo.isCompleted).length

  return (
    <>
      <div className={styles['todo-controls']}>
        <div className={styles['items-left']}>
          {`${itemsLeft} ${itemsLeft === 1 ? 'item' : 'items'} left`}
        </div>
        <TodoFilter />
        <button
          className={styles['clear-button']}
          onClick={() => deleteCompletedTodos()}
          disabled={todos.length === 0}
        >
          Clear Completed
        </button>
      </div>
    </>
  )
}

export { TodoControls }