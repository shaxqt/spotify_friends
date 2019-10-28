import React, { useState, forwardRef, useEffect } from 'react'

import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

export default function VirtualizedList({
  list,
  render,
  LIST_GAP,
  ITEM_HEIGHT,
  HEADER_HEIGHT,
  setShowHeader
}) {
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [lastScrollBottom, setLastScrollBottom] = useState(0)
  const [bodyHeight, setBodyHeight] = useState(0)

  useEffect(() => {
    setBodyHeight(window.innerHeight)
    window.onresize = () => {
      setBodyHeight(window.innerHeight)
    }
    return () => (window.onresize = null)
  }, [])

  return (
    <List
      style={{ top: `-${ITEM_HEIGHT + HEADER_HEIGHT}px` }}
      overscanCount={1}
      onScroll={onScroll}
      className="List"
      height={bodyHeight + ITEM_HEIGHT + HEADER_HEIGHT}
      itemCount={list.length}
      itemSize={ITEM_HEIGHT + LIST_GAP}
    >
      {renderItem}
    </List>
  )
  function renderItem({ index, style }) {
    if (Array.isArray(list) && list.length > index && list[index].item) {
      return (
        <div
          style={{
            ...style,
            paddingTop: LIST_GAP,
            top: `${parseFloat(style.top) + HEADER_HEIGHT + ITEM_HEIGHT}px`
          }}
          key={list[index].item['uri']}
        >
          {render(list[index])}
        </div>
      )
    } else {
      return null
    }
  }
  function onScroll(e) {
    if (e.scrollOffset === 0) {
      setShowHeader(true)
    } else {
      if (e.scrollDirection === 'backward') {
        if (e.scrollOffset + HEADER_HEIGHT < lastScrollTop) {
          setShowHeader(true)
        }
        setLastScrollBottom(e.scrollOffset)
      } else {
        if (e.scrollOffset > lastScrollBottom + HEADER_HEIGHT) {
          setShowHeader(false)
        }
        setLastScrollTop(e.scrollOffset)
      }
    }
  }
}
