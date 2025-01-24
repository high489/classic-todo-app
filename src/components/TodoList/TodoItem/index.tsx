import styles from './todo-item.module.scss'
import { FC } from 'react'

import { Todo } from '@models'
import { useTodoStore } from '@store'
import { CustomCheckbox } from '@ui'
import DeleteTodoIcon from '@assets/icons/delete-todo-icon.svg?react'

interface TodoItemProps {
  todo: Todo
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore()

  return (
    <>
      <li className={styles['todo-item']}>
        <CustomCheckbox
          customStyle={styles['checkbox']}
          checked={todo.isCompleted}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className={`${styles['text']} ${todo.isCompleted ? styles['completed'] : ''}`}>
          {todo.text}
        </span>
        <button
          className={styles['delete-btn']}
          onClick={() => deleteTodo(todo.id)}
        >
          <DeleteTodoIcon />
        </button>
      </li>
    </>
  )
}

export { TodoItem }