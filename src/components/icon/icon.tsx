import React, { CSSProperties } from 'react'
import classnames from 'classnames'
import './icon.less'

interface IconProps {
  name: string,
  fontSize?: number
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
  style?: CSSProperties
  styleName?: string
}

const Icon: React.SFC<IconProps> = ({
  name,
  fontSize,
  onClick,
  className = '',
  style = {},
  styleName = ''
}) => {

  const cls = classnames(`iconfont ${name} ${className}`)

  const s = {
    fontSize: fontSize && fontSize + 'px',
    ...style
  }

  return <i onClick={onClick} className={cls} style={s} styleName={styleName}></i>
}

export default Icon