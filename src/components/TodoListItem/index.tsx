import styles from './todo-list-item.module.scss'
import { FC } from 'react'

import { Todo } from '@models'
import { CustomCheckbox } from '@ui'
import DeleteTodoIcon from '@assets/icons/delete-todo-icon.svg?react'

interface TodoListItemProps {
  todo: Todo
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  height?: string
}

const TodoListItem: FC<TodoListItemProps> = ({
  todo, toggleTodo, deleteTodo, height = '88px'
}) => {

  return (
    <>
      <li
        className={styles['todo-item']}
        style={{ height: height}}
      >
        <CustomCheckbox
          customStyle={styles['checkbox']}
          checked={todo.isCompleted}
          onChange={() => toggleTodo(todo.id)}
        />
        
        <div className={styles['text-wrapper']}>
          <span className={`${styles['text']} ${todo.isCompleted ? styles['completed'] : ''}`}>
            <span>{todo.text}</span>
          </span>
        </div>
        
        <button
          className={styles['delete-button']}
          onClick={() => deleteTodo(todo.id)}
        >
          <DeleteTodoIcon />
        </button>
      </li>
    </>
  )
}

export { TodoListItem }