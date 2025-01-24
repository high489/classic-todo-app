import { TodoManager } from '@src/components'
import styles from './home.module.scss'
import { FC } from 'react'

import TodoLogo from '@assets/icons/todo-logo.svg?react'

const Home: FC = () => {
  return (
    <>
      <div className={styles['home']}>
      <header className={styles['header']}>
        <TodoLogo />
      </header>
        <section>
          <div className='container'>
            <TodoManager />
          </div>
        </section>
      </div>
    </>
  )
}

export { Home }