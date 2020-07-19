import React, { useEffect } from 'react'
import './load-more.less'

interface LoadMoreProps {
  children: React.ReactNodeArray | React.ReactNode
  el?: string | HTMLElement
  load: () => void
}

const LoadMore: React.SFC<LoadMoreProps> = ({ children, load = () => {}, el = '#loadmore-container' }) => {

  useEffect(() => {
    const target = typeof el === 'string' ? document.querySelector(el) : el
    function onScroll () {
      const scrollTop = window.pageYOffset
      || target!.scrollTop
      || target!.scrollTop
      || 0
      const clientHeight = target!.clientHeight
      const scrollHeight = target!.scrollHeight
      if (scrollHeight - scrollTop - clientHeight <= 100) {
        load()
      }
    }
    target && target.addEventListener('scroll', onScroll)
    return () => { target && target.removeEventListener('scroll', onScroll) }
  })

  return <div id="loadmore-container" styleName="loadmore-container">{children}</div>
}

export default LoadMore