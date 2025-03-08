import styles from './todo-filter.module.scss'
import { FC } from 'react'

import { useTodoStore } from '@store'
import { OptionButton } from '@ui'

interface TodoFilterProps {}

const TodoFilter: FC<TodoFilterProps> = () => {
  const { filterOption, setFilterOption } = useTodoStore()

  return (
    <>
      <div className={styles['todo-filter']}>
        <OptionButton
          customStyle={styles['filter-option']}
          onClick={() => setFilterOption('all')}
          disabled={filterOption === 'all'}
          isActive={filterOption === 'all'}
        >
          All
        </OptionButton>
        <OptionButton
          customStyle={styles['filter-option']}
          onClick={() => setFilterOption('active')}
          disabled={filterOption === 'active'}
          isActive={filterOption === 'active'}
        >
          Active
        </OptionButton>
        <OptionButton
          customStyle={styles['filter-option']}
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