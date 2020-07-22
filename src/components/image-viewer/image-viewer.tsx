import React from 'react'
import Icon from 'COMPONENTS/icon/icon'
import './image-viewer.less'

interface ImageViewerProps {
  visible: boolean
}

const ImageViewer: React.SFC<ImageViewerProps>  = (props) => {

  const currentImageStyle = {
    background: 'url(http://p3.music.126.net/xxBaeq-cvQ7w3-WD0ibOAA==/109951165154789504.jpg) no-repeat',
    backgroundSize: 'contain',
    width: '100%'
  }

  return (
    <>
      {
        props.visible && (
          <div styleName="viewer-container">
            <div styleName="viewer-container-left">
              <Icon fontSize={30} name="icon-arrow-left"></Icon>
            </div>
            <div styleName="viewer-container-content">
              <div style={currentImageStyle}></div>
            </div>
            <div styleName="viewer-container-right">
              <Icon fontSize={30} name="icon-arrow-right"></Icon>
            </div>
          </div>
        )
      }
    </>
  )
}

export default ImageViewer