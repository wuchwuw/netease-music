import React from 'react'
import Icon from 'COMPONENTS/icon/icon'
import './no-data.less'

interface NoDataProps {
  text?: string
}

const NoData: React.SFC<NoDataProps> = ({
  text = '暂无数据'
}) => {
  return (
    <div styleName="nodata-container">
      <Icon style={{fontWeight: 100}} className="icon-color-c" fontSize={100} name="icon-default"></Icon>
      <p>{text}</p>
    </div>
  )
}

export default NoData