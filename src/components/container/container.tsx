import { useState, useEffect } from 'react'

export function useContainer (filterNode: string[]) {
  const [visiable, seVisiable] = useState(false)

  function open () {
    seVisiable(true)
  }

  function close () {
    seVisiable(false)
  }

  function onContainerClick (e: MouseEvent) {
    const nodeList = filterNode.map(node => document.querySelector(node))
    const isContain = nodeList.some(value => {
      return value!.contains((e.target as Node))
    })
    if (isContain) return
    close()
  }

  useEffect(() => {
    if (visiable) {
      document.addEventListener('click', onContainerClick)
    }
    return () => {
      document.removeEventListener('click', onContainerClick)
    }
  }, [visiable])

  return {
    visiable,
    open,
    close
  }
}
