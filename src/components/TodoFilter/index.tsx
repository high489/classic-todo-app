import styles from './todo-filter.module.scss'
import { FC } from 'react'

interface TodoFilterProps {}

const TodoFilter: FC<TodoFilterProps> = () => {
  return (
    <>
      <div className={styles['todo-filter']}>TodoFilter</div>
    </>
  )
}

export { TodoFilter }