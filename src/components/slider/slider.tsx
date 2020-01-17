import React, { useEffect, useState } from 'react'
import './slider.less'
import classnames from 'classnames'

const Slider: React.SFC = (props) => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [prevIndex, setPrevIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(2)
  let timer = null

  function loopStart () {
    timer = setInterval(() => {
      next()
    }, 4000)
  }
  function next (index) {
    setCurrentIndex(prev => {
      return round(index ? index : prev + 1)
    })
    setPrevIndex(prev => round(prev + 1))
    setNextIndex(prev => round(prev + 1))
  }
  function round (num) {
    return num > props.images.length - 1 ? 0 : num
  }

  useEffect(() => {
    if (props.images.length) {
      loopStart()
    }
    return function cleanup () {
      clearInterval(timer)
    }
  }, [props.images])

  return (
    <div id="slider"onClick={()=> next(5)}>
      <div id="slider-wrap">
        {
          props.images.map((item: any, index: any) => (
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
      {/* <div class="dot">
        <span
          class="dot-item"
          :class="currentIndex === index ? 'active' : ''"
          v-for="index in images.length"
          :key="index"
        >
        </span>
      </div> */}
    </div>
  )
}

export default Slider