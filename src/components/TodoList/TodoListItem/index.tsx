import styles from './todo-list-item.module.scss'
import { FC } from 'react'

import { Todo } from '@models'
import { useTodoStore } from '@store'
import { CustomCheckbox } from '@ui'
import DeleteTodoIcon from '@assets/icons/delete-todo-icon.svg?react'

interface TodoListItemProps {
  todo: Todo
  height?: string
}

const TodoListItem: FC<TodoListItemProps> = ({ todo, height = '88px' }) => {
  const { toggleTodo, deleteTodo } = useTodoStore()

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
            {todo.text}
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