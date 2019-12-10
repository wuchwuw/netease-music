import React, { useEffect } from 'react'
import './slider.less'
import classnames from 'classnames'

function setStyle (el, styleName, style) {
  el && (el.style[styleName] = style)
}

const Slider: React.SFC = (props) => {
  let shared = {}
  function initSlider () {
    let { wrap, items, len, windowWidth, currentLeft } = shared
    const loopLength = len + 2
    handleLoop(wrap, items)
    setStyle(wrap, 'width', `${windowWidth * loopLength}px`)
    transitionWrap(-currentLeft, 0)
    for (let i = 0; i < items.length; i++) {
      // setStyle(items[i], 'transform', `translate3d(${i * 756}px, 0px, 0px)`)
      setStyle(items[i], 'width', `${windowWidth}px`)
    }
    // this.loopStart()
  }

  function handleLoop () {
    let { wrap, items } = shared
    let firstChild = items[0].cloneNode(true)
    let lastChild = items[items.length - 1].cloneNode(true)
    wrap.insertBefore(lastChild, items[0])
    wrap.appendChild(firstChild)
    // wrap.addEventListener('transitionend', () => {
    //   let { currentLeft, len, windowWidth } = shared
    //   if (currentLeft > windowWidth * len) {
    //     currentLeft = windowWidth
    //     transitionWrap(-currentLeft, 0)
    //     updateShared({ currentLeft })
    //   } else if (currentLeft === 0){
    //     currentLeft = windowWidth * len
    //     transitionWrap(-currentLeft, 0)
    //     updateShared({ currentLeft })
    //   }
    // })
    // loopStart()
  }

  function transitionWrap (left, duration) {
    let { wrap } = shared
    setStyle(wrap, 'transitionDuration', `${duration}ms`)
    setStyle(wrap, 'transform', `translate3d(${left}px, 0px, 0px)`)
  }
  function loopStart () {
    setInterval(() => {
      next()
    }, 4000)
  }
  function next () {
    let { wrap, windowWidth, currentLeft } = shared
    currentLeft += windowWidth
    transitionWrap(-currentLeft, 300)
    // updateCurrentIndex(true)
    updateShared({ currentLeft })
  }
  function updateShared (o) {
    Object.keys(o).forEach(key => {
      shared[key] = o[key]
    })
  }
  
  useEffect(() => {
    console.log(props.images)
    if (props.images.length) {
      shared = {
        windowWidth: 756,
        currentLeft: 756,
        wrap: document.getElementById('slider-wrap'),
        items: document.getElementsByClassName('slider-item'),
        len: props.images.length
      }
      initSlider()
    }
  }, [props.images])

  return (
    <div id="slider">
      <div id="slider-wrap">
        {
          props.images.map((item: any) => (
            <div className="slider-item" key={item.imageUrl}>
              <img className="slider-img" src={item.imageUrl} alt="" />
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