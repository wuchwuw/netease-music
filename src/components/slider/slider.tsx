import React, { useEffect, useState, useRef } from 'react'
import './slider.less'
import classnames from 'classnames'

interface SliderProps {
  images: any[]
}

const Slider: React.SFC<SliderProps> = ({ images = []}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const savedCallback = useRef<any>()
  let timer = null

  function loopStart () {
    timer = setInterval(() => {
      console.log(111)
      savedCallback.current()
    }, 4000)
  }

  function next (index?: number) {
    const current = round(index ? index : currentIndex + 1)
    const prev = round(current - 1)
    const next = round(current + 1)
    setCurrentIndex(current)
    setPrevIndex(prev)
    setNextIndex(next)
  }

  useEffect(() => {
    savedCallback.current = next
  })

  function round (num: number) {
    if (num < 0) {
      return images.length - 1
    } else if (num > images.length - 1) {
      return 0
    } else {
      return num
    }
  }

  useEffect(() => {
    if (images.length) {
      setCurrentIndex(0)
      setPrevIndex(images.length - 1)
      setNextIndex(1)
      loopStart()
    }
    return function cleanup () {
      clearInterval(timer)
    }
  }, [images.length])

  return (
    <div id="slider">
      <div id="slider-wrap">
        {
          images.map((item: any, index: any) => (
            <div
              className={classnames("slider-item", {
                'left': index === prevIndex,
                'right': index === nextIndex,
                'active': index === currentIndex
              })}
              key={index}
            >
              <img className="slider-img" src={item.imageUrl || item.pic} alt="" />
            </div>
          ))
        }
      </div>
      <div className="dot">
        {
          images.map((item: any, index: any) => (
            <span
              onClick={()=> next(index)}
              className={classnames('dot-item', { 'active': currentIndex === index })}
              key={index}
            >
            </span>
          ))
        }
      </div>
      <div onClick={() => { next(round(currentIndex - 1)) }} className="slider-control slider-left"><i className="iconfont icon-arrow-left"></i></div>
      <div onClick={() => { next(round(currentIndex + 1)) }} className="slider-control slider-right"><i className="iconfont icon-arrow-right"></i></div>
    </div>
  )
}

export default Slider