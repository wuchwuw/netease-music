import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import './page-title.less'

interface PageTitleProps {
  children: React.ReactNode
}

const PageTitle: React.SFC<PageTitleProps> = (props) => {
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  return (
    fullScreen ? <></> : <div className="page-title-container">{props.children}</div>
  )
}

export default PageTitle