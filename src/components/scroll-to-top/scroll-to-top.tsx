import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export function scrollToTop (node?: string[]) {
  const defaultNode = document.querySelector('.main-right')
  const defaultPlayerNode = document.querySelector('.player')
  if (node) {
    node.forEach(item => {
      const scrollEl = document.querySelector(item)
      scrollEl && scrollEl.scrollTo(0, 0)
    })
  } else {
    [defaultNode, defaultPlayerNode].forEach(node => {
      node && node.scrollTo(0, 0)
    })
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const node = ['.main-right']

  useEffect(() => {
    node.forEach(item => {
      const scrollEl = document.querySelector(item)
      if (scrollEl) {
        scrollEl.scrollTo(0, 0)
      }
    })
  }, [pathname])

  return null
}

export default ScrollToTop