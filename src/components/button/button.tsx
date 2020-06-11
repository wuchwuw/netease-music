import * as React from 'react'
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
}

const Button: React.SFC<ButtonProps> = ({
  type = 'default',
  loading = false,
  icon,
  onClick,
  children,
  disabled = false
}) => {
  const [innerLoading, setInnerLoading] = React.useState(!!loading)
  const classes = classnames('button-commen', {
    [`button-type-${type}`]: type,
    [`button-type-disabled`]: disabled
  })

  React.useEffect(() => {
    setInnerLoading(loading)
  }, [loading])

  const getChildren = () => {
    // if (loading) {}
    // if (icon) {}
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
      className={classes}
      onClick={handleClick}
    >
      {getChildren()}
    </button>
  )
}

export default Button
