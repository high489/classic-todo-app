import styles from './todo-list.module.scss'
import { FC, RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { useMatchMedia, useScrollbar } from '@hooks'
import { useTodoStore } from '@store'
import { TodoListItem } from '@components'

interface TodoListProps {}

const TodoList: FC<TodoListProps> = () => {
  const { getSortedTodos, filterOption, toggleTodo, deleteTodo } = useTodoStore()
  const todos = getSortedTodos()
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterOption) {
        case 'active': return !todo.isCompleted
        case 'completed': return todo.isCompleted
        default: return todo
      }
    })
  }, [todos, filterOption])

  const listRef = useRef<HTMLElement>(null)
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useMatchMedia()
  const [ {visibleTodos, todoHeight}, setListConfig ] = useState({visibleTodos: 4, todoHeight: 88})

  useEffect(() => {
    setListConfig((prev) => {
      let newConfig = { ...prev }
      switch (true) {
        case isMobile:
          newConfig = { visibleTodos: 5, todoHeight: 55 }
          break
        case isTablet:
          newConfig = { visibleTodos: 5, todoHeight: 72 }
          break
        case isDesktop:
          newConfig = { visibleTodos: 4, todoHeight: 88 }
          break
        case isLargeDesktop:
          newConfig = { visibleTodos: 4, todoHeight: 88 }
          break
        default:
          newConfig = { visibleTodos: 4, todoHeight: 88 }
      }
      return prev.visibleTodos === 
        (newConfig.visibleTodos && prev.todoHeight === newConfig.todoHeight)
        ? prev
        : newConfig
    })
  }, [isMobile, isTablet, isDesktop, isLargeDesktop])

  const hasScrollbar = !isMobile && filteredTodos.length * todoHeight > visibleTodos * todoHeight
  const { scrollbarThumbRef, handleScrollMouseDown } = useScrollbar(listRef, hasScrollbar)

  return (
    <div 
      className={styles['todo-list-wrapper']}
      style={{ height: `${visibleTodos * todoHeight}px` }}
    >
      <ul
        className={styles['todo-list']}
        ref={listRef as RefObject<HTMLUListElement>}
      >
        {filteredTodos.reverse().map(todo => (
          <TodoListItem 
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            height={`${todoHeight}px`}
          />
        ))}
      </ul>
      {hasScrollbar && (
        <div className={styles['scrollbar']}>
          <div
            className={styles['scrollbar-thumb']}
            ref={scrollbarThumbRef as RefObject<HTMLDivElement>}
            onMouseDown={handleScrollMouseDown}
          ></div>
        </div>
      )}
    </div>
  )
}

export { TodoList }