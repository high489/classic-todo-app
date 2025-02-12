import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const useScroll = (hasScroll: boolean, scrollContainerRef?: React.RefObject<HTMLElement>) => {
  const listRef = scrollContainerRef || useRef<HTMLElement>(null)
  const scrollbarThumbRef = useRef<HTMLElement>(null)

  const [isDraggingScroll, setIsDraggingScroll] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const updateScrollThumbPosition = useCallback(() => {
    const list = listRef.current
    const thumb = scrollbarThumbRef.current
    if (list && thumb) {
      const scrollHeight = list.scrollHeight - list.clientHeight
      const maxThumbTop = thumb.parentElement!.clientHeight - thumb.clientHeight
      const thumbTop = (list.scrollTop / scrollHeight) * maxThumbTop

      thumb.style.transform = `translateY(${Math.max(0, Math.min(thumbTop, maxThumbTop))}px)`
    }
  }, [listRef])

  const handleScroll = useCallback(() => {
    updateScrollThumbPosition()
  }, [updateScrollThumbPosition])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!hasScroll || !listRef.current) return
      e.preventDefault()
      listRef.current.scrollTop += e.deltaY
      updateScrollThumbPosition()
    },
    [hasScroll, updateScrollThumbPosition],
  )

  const handleListTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!hasScroll) return
      setStartY(e.touches[0].clientY)
      setScrollTop(listRef.current?.scrollTop || 0)
    },
    [hasScroll, listRef],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!hasScroll || !listRef.current) return
      e.preventDefault()
      const deltaY = startY - e.touches[0].clientY
      listRef.current.scrollTop = Math.max(0, scrollTop + deltaY)
      updateScrollThumbPosition()
    },
    [hasScroll, startY, scrollTop, updateScrollThumbPosition],
  )

  const handleScrollMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!hasScroll) return
      setIsDraggingScroll(true)
      setStartY(e.type === 'touchstart' ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY)
      setScrollTop(listRef.current?.scrollTop || 0)
      e.preventDefault()
    },
    [hasScroll, listRef],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingScroll || !listRef.current || !scrollbarThumbRef.current) return
      e.preventDefault()
      const deltaY =
        (e.type === 'touchmove' ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY) - startY

      const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight
      const maxThumbHeight = scrollbarThumbRef.current.parentElement!.clientHeight
      const scrollDelta = (deltaY / maxThumbHeight) * scrollHeight

      listRef.current.scrollTop = Math.max(0, scrollTop + scrollDelta)
      updateScrollThumbPosition()
    },
    [isDraggingScroll, startY, scrollTop, updateScrollThumbPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDraggingScroll(false)
  }, [])

  useLayoutEffect(() => {
    if (listRef.current && scrollbarThumbRef.current) {
      const list = listRef.current
      const thumb = scrollbarThumbRef.current

      const visibleRatio = list.clientHeight / list.scrollHeight
      thumb.style.height = `${Math.max(visibleRatio * list.clientHeight, 20)}px`
      updateScrollThumbPosition()
    }
  }, [hasScroll, updateScrollThumbPosition])

  useEffect(() => {
    if (!listRef.current || !hasScroll) return

    const list = listRef.current
    list.addEventListener('scroll', handleScroll)
    list.addEventListener('wheel', handleWheel, { passive: false })
    list.addEventListener('touchmove', handleTouchMove, { passive: false })

    if (isDraggingScroll) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleMouseMove, { passive: false })
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      list.removeEventListener('scroll', handleScroll)
      list.removeEventListener('wheel', handleWheel)
      list.removeEventListener('touchmove', handleTouchMove)

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [hasScroll, isDraggingScroll, handleScroll, handleWheel, handleTouchMove, handleMouseMove, handleMouseUp])

  return {
    listRef,
    scrollbarThumbRef,
    handleListTouchStart,
    handleScrollMouseDown,
  }
}

export { useScroll }
