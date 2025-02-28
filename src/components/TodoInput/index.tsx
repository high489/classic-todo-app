import styles from './todo-input.module.scss'
import { FC, useState } from 'react'

import { useTodoStore } from '@store'
import { ActionButton, CustomInput } from '@ui'

interface TodoInputProps {}

const TodoInput: FC<TodoInputProps> = () => {
  const [ todoText, setTodoText ] = useState<string>('')
  const { addTodo } = useTodoStore()

  const handleAddTask = () => {
    if (todoText.trim()) {
      addTodo(todoText)
      setTodoText('')
    } else {
      setTodoText('')
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTask()
      e.currentTarget.blur()
    } 
  }

  return (
    <>
      <div className={styles['todo-input']}>
        <CustomInput
          customStyle={styles['input-field']}
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          onKeyDown={handleEnterKey}
          placeholder='What needs to be done?'
        />
        <ActionButton
          customStyle={styles['add-todo-button']}
          onClick={handleAddTask}
        >
          ADD
        </ActionButton>
      </div>
    </>
  )
}

export { TodoInput }