import styles from './todo-input.module.scss'
import { FC, useState } from 'react'

import { useTodoStore } from '@store'
import { CustomButton, CustomInput } from '@ui'

interface TodoInputProps {}

const TodoInput: FC<TodoInputProps> = () => {
  const [ todoText, setTodoText ] = useState<string>('')
  const { addTodo } = useTodoStore()

  const handleAddTask = () => {
    if (todoText.trim()) {
      addTodo(todoText)
      setTodoText('')
    }
  }

  return (
    <>
      <div className={styles['todo-input']}>
        <CustomInput
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder='What do you need to do?'
        />
        <CustomButton onClick={handleAddTask}>ADD</CustomButton>
      </div>
    </>
  )
}

export { TodoInput }