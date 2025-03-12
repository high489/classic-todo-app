import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const useScrollbar = (listRef: React.RefObject<HTMLElement>, hasScrollbar: boolean = true) => {
  const scrollbarThumbRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const updateScrollThumbPosition = useCallback(() => {
    if (!listRef.current || !scrollbarThumbRef.current) return

    const { scrollTop: listScrollTop, scrollHeight, clientHeight } = listRef.current
    const thumbHeight = scrollbarThumbRef.current.clientHeight
    const maxThumbTop = scrollbarThumbRef.current.parentElement!.clientHeight - thumbHeight

    let thumbTop = (listScrollTop / (scrollHeight - clientHeight)) * maxThumbTop
    thumbTop = Math.max(0, Math.min(thumbTop, maxThumbTop))

    scrollbarThumbRef.current.style.transform = `translateY(${thumbTop}px)`
  }, [listRef])

  const updateScrollbar = useCallback(() => {
    if (!listRef.current || !scrollbarThumbRef.current) return

    const list = listRef.current
    const thumb = scrollbarThumbRef.current
    const visibleRatio = list.clientHeight / list.scrollHeight
    const thumbHeight = Math.max(visibleRatio * list.clientHeight, 20)

    thumb.style.height = `${thumbHeight}px`

    if (hasScrollbar && list.scrollHeight > list.clientHeight) {
      thumb.parentElement!.style.height = `${list.clientHeight}px`
    } else {
      thumb.parentElement!.style.height = '0px'
    }

    updateScrollThumbPosition()
  }, [listRef, hasScrollbar, updateScrollThumbPosition])

  const handleScroll = useCallback(() => {
    updateScrollThumbPosition()
  }, [updateScrollThumbPosition])

  const handleScrollMouseDown = useCallback((e: React.MouseEvent) => {
    if (!hasScrollbar) return
    setIsDragging(true)
    setStartY(e.clientY)
    setScrollTop(listRef.current?.scrollTop || 0)
    e.preventDefault()
  }, [hasScrollbar, listRef])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !listRef.current) return

    const deltaY = e.clientY - startY
    const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight
    const scrollDelta = (deltaY / scrollbarThumbRef.current!.parentElement!.clientHeight) * scrollHeight

    listRef.current.scrollTop = Math.max(0, scrollTop + scrollDelta)
    updateScrollThumbPosition()
  }, [isDragging, startY, scrollTop, listRef, updateScrollThumbPosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // initial initialization during mounting
  useLayoutEffect(() => {
    updateScrollbar()
  }, [listRef, hasScrollbar, updateScrollbar])

  // watching for changes of listRef with MutationObserver
  useEffect(() => {
    if (!listRef.current) return

    const observer = new MutationObserver(() => {
      updateScrollbar()
    })

    observer.observe(listRef.current, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [listRef, updateScrollbar])

  // watching for resizes of listRef
  useEffect(() => {
    if (!listRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      updateScrollbar()
    })

    resizeObserver.observe(listRef.current)

    return () => resizeObserver.disconnect()
  }, [listRef, updateScrollbar])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll)
    }
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener('scroll', handleScroll)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleScroll, handleMouseMove, handleMouseUp])

  return { scrollbarThumbRef, handleScrollMouseDown }
}

export { useScrollbar }