import styles from './todo-list.module.scss'
import { FC, RefObject, useRef } from 'react'

import { useMatchMedia, useScrollbar } from '@hooks'
import { useTodoStore } from '@store'
import { TodoListItem } from './TodoListItem'

interface TodoListProps {}

const TodoList: FC<TodoListProps> = () => {
  const { getSortedTodos, filterOption } = useTodoStore()
  const todos = getSortedTodos()
  const filteredTodos = todos.filter((todo) => {
    switch (filterOption) {
      case 'active': return !todo.isCompleted
      case 'completed': return todo.isCompleted
      default: return todo
    }
  })
  // screen type
  const { isMobile, isTablet } = useMatchMedia()
  const hasScrollbar = !(isMobile || isTablet) && filteredTodos.length > 4
  const listRef = useRef<HTMLElement>(null)
  const { scrollbarThumbRef, handleScrollMouseDown } = useScrollbar(listRef, hasScrollbar)

  return (
    <div className={styles['todo-list-wrapper']} >
       <ul
         className={styles['todo-list']}
         ref={listRef as RefObject<HTMLUListElement>}
       >
         {filteredTodos.map(todo => (
           <TodoListItem key={todo.id} todo={todo}/>
         ))}
       </ul>
       <div className={styles['scrollbar']} style={{ opacity: hasScrollbar ? 1 : 0}}>
          <div
            className={styles['scrollbar-thumb']}
            ref={scrollbarThumbRef as RefObject<HTMLDivElement>}
            onMouseDown={handleScrollMouseDown}
          ></div>
        </div>
     </div>
  )
}

export { TodoList }