import React, { useEffect } from 'react'
import './load-more.less'

interface LoadMoreProps {
  children: React.ReactNodeArray | React.ReactNode
  load: () => void
}

const LoadMore: React.SFC<LoadMoreProps> = ({ children, load = () => {} }) => {

  useEffect(() => {
    const target = document.querySelector('.loadmore-container')
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
    target!.addEventListener('scroll', onScroll)
    return () => { target!.removeEventListener('scroll', onScroll) }
  })

  return <div styleName="loadmore-container">{children}</div>
}

export default LoadMore