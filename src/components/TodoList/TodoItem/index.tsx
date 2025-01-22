import styles from './todo-item.module.scss'
import { FC } from 'react'

import { Todo } from '@models'
import { useTodoStore } from '@store'
import { CustomCheckbox } from '@ui'

interface TodoItemProps {
  todo: Todo
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo } = useTodoStore()

  return (
    <>
      <li className={styles['todo-item']}>
        <CustomCheckbox
          checked={todo.isCompleted}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className={`${styles['text']} ${todo.isCompleted ? styles['completed'] : ''}`}>
          {todo.text}
        </span>
      </li>
    </>
  )
}

export { TodoItem }