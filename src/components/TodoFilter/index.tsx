import styles from './todo-filter.module.scss'
import { FC } from 'react'

import { useTodoStore } from '@store'
import { OptionButton } from '@src/ui/buttons/OptionButton'

interface TodoFilterProps {}

const TodoFilter: FC<TodoFilterProps> = () => {
  const { filterOption, setFilterOption } = useTodoStore()

  return (
    <>
      <div className={styles['todo-filter']}>
        <OptionButton
          onClick={() => setFilterOption('all')}
          disabled={filterOption === 'all'}
          isActive={filterOption === 'all'}
        >
          All
        </OptionButton>
        <OptionButton
          onClick={() => setFilterOption('active')}
          disabled={filterOption === 'active'}
          isActive={filterOption === 'active'}
        >
          Active
        </OptionButton>
        <OptionButton
          onClick={() => setFilterOption('completed')}
          disabled={filterOption === 'completed'}
          isActive={filterOption === 'completed'}
        >
          Completed
        </OptionButton>
      </div>
    </>
  )
}

export { TodoFilter }