import { TodoManager } from '@src/components'
import styles from './home.module.scss'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <>
      <div className={styles['home']}>
      <header></header>
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