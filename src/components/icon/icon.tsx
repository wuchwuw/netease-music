import React from 'react'
import classnames from 'classnames'
import './icon.less'

interface IconProps {
  name: string,
  fontSize?: number
  onClick?: React.MouseEventHandler<HTMLElement>
  active?: boolean
  activeClassName?: string
  className?: string
}

const Icon: React.SFC<IconProps> = ({
  name,
  fontSize = 16,
  onClick,
  active = false,
  activeClassName,
  className
}) => {

  const cls = classnames(`iconfont ${name} ${className}`, {
   [ activeClassName ? activeClassName : 'icon-active']: active
  })

  const style = {
    fontSize: fontSize + 'px'
  }

  return <i onClick={onClick} className={cls} style={style}></i>
}

export default Icon