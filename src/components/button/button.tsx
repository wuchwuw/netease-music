import * as React from 'react'
import classnames from 'classnames'
import './button.less'

interface ButtonProps {
  type?: 'default' | 'primary'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

const Button: React.SFC<ButtonProps> = ({
  type = 'default',
  loading = false,
  icon,
  children
}) => {
  const [innerLoading, setInnerLoading] = React.useState(!!loading)
  const classes = classnames('button-commen', {
    [`button-type-${type}`]: type
  })

  const getChildren = () => {
    // if (loading) {}
    // if (icon) {}
    return children
  }

  return <button className={classes}>{getChildren()}</button>
}

export default Button
