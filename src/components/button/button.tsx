import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import './button.less'
import Loading from 'COMPONENTS/loading/loading'

interface ButtonProps {
  type?: 'default' | 'primary'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  block?: boolean
}

const Button: React.SFC<ButtonProps> = ({
  type = 'default',
  loading = false,
  icon,
  onClick,
  children,
  disabled = false,
  block = false
}) => {
  const [innerLoading, setInnerLoading] = useState(!!loading)
  const classes = classnames('button-commen', {
    [`button-${type}`]: type,
    'button-disabled': disabled,
    'button-block': block
  })

  useEffect(() => {
    setInnerLoading(loading)
  }, [loading])

  const getChildren = () => {
    if (innerLoading) {
      return (
        <>
          <Loading></Loading>
          {children}
        </>
      )
    }
    if (icon) {
      return (
        <>
          {icon}
          {children}
        </>
      )
    }
    return children
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (innerLoading || disabled) {
      return
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      styleName={classes}
      onClick={handleClick}
    >
      <div styleName='button-content'>
        {getChildren()}
      </div>
    </button>
  )
}

export default Button
