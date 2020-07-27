import React, { useState, forwardRef, useImperativeHandle } from 'react'
import Icon from 'COMPONENTS/icon/icon'
import './image-viewer.less'
import Loading from 'COMPONENTS/loading/loading'

interface ImageViewerProps {}
export interface ImageViewerRef {
  open: (url: string, images: string[]) => void
}

const ImageViewer = forwardRef((props: ImageViewerProps, ref) => {
  const [images, setImages] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const currentImageStyle = {
    backgroundImage: `url(${current})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundClip: 'content-box'
  }

  useImperativeHandle(ref, () => ({
    open (url: string, images: string[]) {
      setImages(images)
      createImage(url)
      setVisible(true)
    }
  }), [])

  function createImage (url: string) {
    const img = new Image()
    img.src = url
    if (!img.complete) {
      setLoading(true)
    }
    img.onload = () => {
      if (img.complete) {
        setLoading(false)
        setCurrent(url)
      }
    }
  }

  function next (type: 'next' | 'prev') {
    let index = images.indexOf(current)
    let currentIndex = type === 'next' ? ++index : --index
    setCurrent(images[Math.min(Math.max(0, currentIndex), images.length - 1)])
  }

  return (
    <>
      {
        visible && (
          <div styleName="viewer-container">
            <Icon onClick={() => setVisible(false)} styleName="viewer-close" name="icon-close"></Icon>
            <div styleName="viewer-container-left">
              <Icon onClick={() => next('prev')} fontSize={30} name="icon-arrow-left"></Icon>
            </div>
            <div styleName="viewer-container-content">
              {
                loading ?
                  <Loading size={40}></Loading>
                :
                  <div styleName="viewer-container-content-background" style={currentImageStyle}></div>
              }
            </div>
            <div styleName="viewer-container-right">
              <Icon onClick={() => next('next')} fontSize={30} name="icon-arrow-right"></Icon>
            </div>
          </div>
        )
      }
    </>
  )
})

export default ImageViewer