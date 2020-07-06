import React, { useEffect, useState, useRef } from 'react'
import './slider.less'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { getSongList } from 'UTIL/song'
import { usePlayerController } from 'UTIL/player-controller'
import Icon from 'COMPONENTS/icon/icon'

export interface ImageItem {
  targetId: number
  targetType: number
  imageUrl: string
  titleColor: string
  typeTitle: string
  url: string
}

interface SliderProps {
  images: ImageItem[]
}

const Slider: React.SFC<SliderProps> = ({ images = []}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const savedCallback = useRef<any>()
  const { goAlbumDetail, goMVDetail } = usePageForword()
  const { start } = usePlayerController()
  let timer: NodeJS.Timeout | null = null

  function loopStart () {
    timer = setInterval(() => {
      savedCallback.current()
    }, 4000)
  }

  function next (index?: number) {
    const current = round(typeof index !== 'undefined' ? index : currentIndex + 1)
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
      clearInterval(timer!)
    }
  }, [images.length])

  async function handleImageClick (e: React.MouseEvent<HTMLElement> ,item: ImageItem) {
    e.stopPropagation()
    const { targetType, targetId, url } = item
    if (targetType === 1) {
      const songs = await getSongList([targetId])
      songs.length && start({id: '/home/index', name: '发现页'}, songs[0])
    } else if (targetType === 10) {
      goAlbumDetail(targetId)
    } else if (targetType === 1004) {
      goMVDetail(targetId)
    } else if (targetType === 3000) {
      window.open(url)
    }
  }

  return (
    <div styleName="slider">
      <div styleName="slider-wrap">
        {
          images.map((item, index: any) => (
            <div
              onClick={(e) => { handleImageClick(e, item) }}
              styleName={classnames("slider-item", {
                'left': index === prevIndex,
                'right': index === nextIndex,
                'active': index === currentIndex
              })}
              key={index}
            >
              <img styleName="slider-img" src={item.imageUrl} alt="" />
              <div styleName={classnames('slider-item-tag', item.titleColor )}>{item.typeTitle}</div>
            </div>
          ))
        }
      </div>
      <div styleName="dot">
        {
          images.map((item: any, index: any) => (
            <span
              onClick={()=> next(index)}
              styleName={classnames('dot-item', { 'active': currentIndex === index })}
              key={index}
            >
            </span>
          ))
        }
      </div>
      <div onClick={() => { next(round(currentIndex - 1)) }} styleName="slider-control slider-left"><Icon name="icon-arrow-left"></Icon></div>
      <div onClick={() => { next(round(currentIndex + 1)) }} styleName="slider-control slider-right"><Icon name="icon-arrow-right"></Icon></div>
    </div>
  )
}

export default Slider