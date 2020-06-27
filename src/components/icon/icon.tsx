import React, { CSSProperties } from 'react'
import classnames from 'classnames'
import './icon.less'

interface IconProps {
  name: string,
  fontSize?: number
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
  style?: CSSProperties
}

const Icon: React.SFC<IconProps> = ({
  name,
  fontSize = 16,
  onClick,
  className = '',
  style = {}
}) => {

  const cls = classnames(`iconfont ${name} ${className}`)

  const s = {
    fontSize: fontSize + 'px',
    ...style
  }

  return <i onClick={onClick} className={cls} style={s}></i>
}

export default Icon