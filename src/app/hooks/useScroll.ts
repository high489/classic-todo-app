import { useCallback, useEffect, useRef, useState } from 'react'


const useScroll = (hasScroll: boolean) => {
  const listRef = useRef<HTMLElement>(null)
  const scrollbarThumbRef = useRef<HTMLElement>(null)

  const [isDraggingScroll, setIsDraggingScroll] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  // calculate scrollbar thumb position
  const updateScrollThumbPosition = useCallback(() => {
    if (listRef.current && scrollbarThumbRef.current) {
      const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight
      const thumbHeight = scrollbarThumbRef.current.clientHeight
      const maxThumbTop = scrollbarThumbRef.current.parentElement!.clientHeight - thumbHeight
      let thumbTop = (listRef.current.scrollTop / scrollHeight) * maxThumbTop
      thumbTop = Math.max(0, Math.min(thumbTop, maxThumbTop))
      scrollbarThumbRef.current.style.transform = `translateY(${thumbTop}px)`
    }
  }, [])

  // handling of scroll by mouse wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!hasScroll || !listRef.current) return
    e.preventDefault()
    listRef.current.scrollTop += e.deltaY
    updateScrollThumbPosition()
  }, [hasScroll])

  // handling of start touching list
  const handleListTouchStart = useCallback((e: React.TouchEvent) => {
    if (!hasScroll) return
    setStartY(e.touches[0].clientY)
    setScrollTop(listRef.current?.scrollTop || 0)
  }, [hasScroll])

  // handling of scroll by touch move grabbing list
  const handleTouchMoveByList = useCallback((e: TouchEvent) => {
    if (!hasScroll) return
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return

    if (listRef.current) {
      e.preventDefault()
      const deltaY = startY - e.touches[0].clientY
      listRef.current.scrollTop = Math.max(0, scrollTop + deltaY)
      updateScrollThumbPosition()
    }
  }, [hasScroll, startY, scrollTop])

  // handling of start scrolling thumb
  const handleScrollMouseDown = useCallback((e: React.MouseEvent) => {
    if (!hasScroll) return
    setIsDraggingScroll(true)
    setStartY(e.clientY)
    setScrollTop(listRef.current?.scrollTop || 0)
    e.preventDefault()
  }, [hasScroll])

  // handling of start touching scrolbar thumb
  const handleScrollTouchStart = useCallback((e: React.TouchEvent) => {
    if (!hasScroll) return
    setIsDraggingScroll(true)
    setStartY(e.touches[0].clientY)
    setScrollTop(listRef.current?.scrollTop || 0)
  }, [hasScroll])

  // handling of scroll by mouse move grabbing scrolbar thumb
  const handleMouseMoveByScroll = useCallback((e: MouseEvent) => {
    if (!isDraggingScroll || !listRef.current) return
    const deltaY = e.clientY - startY
    const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight
    const scrollDelta = (deltaY / scrollbarThumbRef.current!.parentElement!.clientHeight) * scrollHeight
    listRef.current.scrollTop = Math.max(0, scrollTop + scrollDelta)
    updateScrollThumbPosition()
  }, [isDraggingScroll, startY, scrollTop])

  // handling of scroll by touch move grabbing scrollbar thumb
  const handleTouchMoveByScroll = useCallback((e: TouchEvent) => {
    if (!isDraggingScroll || !listRef.current) return
    e.preventDefault()
    const deltaY = e.touches[0].clientY - startY
    const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight
    const scrollDelta = (deltaY / scrollbarThumbRef.current!.parentElement!.clientHeight) * scrollHeight
    listRef.current.scrollTop = Math.max(0, scrollTop + scrollDelta)
    updateScrollThumbPosition()
  }, [isDraggingScroll, startY, scrollTop])

  const handleMouseUp = useCallback(() => {
    setIsDraggingScroll(false)
  }, [])

  useEffect(() => {
    if (listRef.current && scrollbarThumbRef.current) {
      const visibleRatio = listRef.current.clientHeight / listRef.current.scrollHeight
      const thumbHeight = Math.max(visibleRatio * listRef.current.clientHeight, 20)
      scrollbarThumbRef.current.parentElement!.style.height = `${listRef.current.clientHeight}px`
      scrollbarThumbRef.current.style.height = `${thumbHeight}px`
      updateScrollThumbPosition()
    }
  }, [hasScroll, updateScrollThumbPosition])

  useEffect(() => {
    const listElem = listRef.current

    if (listElem && hasScroll) {
      listElem.addEventListener('wheel', handleWheel, { passive: false })
      listElem.addEventListener('touchmove', handleTouchMoveByList, { passive: false })
    }

    if (isDraggingScroll) {
      document.addEventListener('mousemove', handleMouseMoveByScroll)
      document.addEventListener('touchmove', handleTouchMoveByScroll, { passive: false })
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      if (listElem) {
        listElem.removeEventListener('wheel', handleWheel)
        listElem.removeEventListener('touchmove', handleTouchMoveByList)
      }
      document.removeEventListener('mousemove', handleMouseMoveByScroll)
      document.removeEventListener('touchmove', handleTouchMoveByScroll)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [
    hasScroll,
    isDraggingScroll,
    handleWheel,
    handleTouchMoveByList,
    handleMouseMoveByScroll,
    handleTouchMoveByScroll,
    handleMouseUp,
  ])

  return {
    listRef,
    scrollbarThumbRef,
    handleListTouchStart,
    handleScrollMouseDown,
    handleScrollTouchStart,
  }

}

export { useScroll }
