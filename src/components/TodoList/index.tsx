import styles from './todo-list.module.scss'
import { FC, RefObject, useEffect, useRef, useState } from 'react'
import { useMatchMedia, useScroll } from '@hooks'
import { useTodoStore } from '@store'
import { TodoListItem } from './TodoListItem'

const TodoList: FC = () => {
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
  const { isMobile } = useMatchMedia()
  // should have a scrollbar
  const [hasScrollbar, setHasScrollbar] = useState(false)
  // should have a scroll
  const hasScroll = filteredTodos.length > 4

  const listRef = useRef<HTMLUListElement>(null)
  const {
    scrollbarThumbRef,
    handleListTouchStart,
    handleScrollMouseDown,
  } = useScroll(hasScroll, listRef)

  useEffect(() => {
    setHasScrollbar(!isMobile && hasScroll)
  }, [hasScroll, isMobile])

  return (
    <div className={styles['todo-list-wrapper']}>
      <ul
        className={styles['todo-list']}
        ref={listRef} 
        onTouchStart={handleListTouchStart}
      >
        {filteredTodos.map(todo => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </ul>
      <div className={styles['scrollbar']} style={{ opacity: hasScrollbar ? 1 : 0 }}>
        <div
          className={styles['scrollbar-thumb']}
          ref={scrollbarThumbRef as RefObject<HTMLDivElement>}
          onMouseDown={handleScrollMouseDown}></div>
      </div>
    </div>
  )
}

export { TodoList }


// import styles from './todo-list.module.scss'
// import { FC, RefObject, useEffect, useState } from 'react'

// import { useMatchMedia, useScroll } from '@hooks'
// import { useTodoStore } from '@store'
// import { TodoListItem } from './TodoListItem'

// interface TodoListProps {}

// const TodoList: FC<TodoListProps> = () => {
//   const { getSortedTodos, filterOption } = useTodoStore()
//   const todos = getSortedTodos()
//   const filteredTodos = todos.filter((todo) => {
//     switch (filterOption) {
//       case 'active': return !todo.isCompleted
//       case 'completed': return todo.isCompleted
//       default: return todo
//     }
//   })
//   // screen type
//   const { isMobile } = useMatchMedia()
//   // should have a scrollbar
//   const [hasScrollbar, setHasScrollbar] = useState(false)
//   // should have a scroll
//   const hasScroll = filteredTodos.length > 4
//   const {
//     listRef,
//     scrollbarThumbRef,
//     handleListTouchStart,
//     handleScrollMouseDown,
//     handleScrollTouchStart,
//   } = useScroll(hasScroll)
  
//   useEffect(() => {
//     if (listRef.current) setHasScrollbar(!isMobile && hasScroll)
//   }, [hasScroll, isMobile])

//   return (
//     <div className={styles['todo-list-wrapper']} >
//        <ul
//          className={styles['todo-list']}
//          ref={listRef as RefObject<HTMLUListElement>}
//          onTouchStart={handleListTouchStart}
//        >
//          {filteredTodos.map(todo => (
//            <TodoListItem key={todo.id} todo={todo}/>
//          ))}
//        </ul>
//        <div className={styles['scrollbar']} style={{ opacity: hasScrollbar ? 1 : 0}}>
//           <div
//             className={styles['scrollbar-thumb']}
//             ref={scrollbarThumbRef as RefObject<HTMLDivElement>}
//             onMouseDown={handleScrollMouseDown}
//             onTouchStart={handleScrollTouchStart}
//           ></div>
//         </div>
//      </div>
//   )
// }

// export { TodoList }