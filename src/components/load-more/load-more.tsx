import React, { useEffect } from 'react'
import './load-more.less'

const LoadMore = (props) => {
  useEffect(() => {
    console.log(111)
    function onScroll () {
      console.log(111)
    }
    const target = document.querySelector('.loadmore-container')
    console.log(target)
    target.addEventListener('scroll', onScroll)
    // return () => { target.removeEventListener('scroll', onScroll) }
  }, [])
  return <div className="loadmore-container">{props.children}</div>
}

export default LoadMore