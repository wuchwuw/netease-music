import React from 'react'
import './spin.less'

interface SpinProps {
  children: React.ReactNodeArray
  loading: boolean
  delay: number
}

const Spin: React.SFC<SpinProps> = (props) => {
  return (
    <div className="spin-container">
      {
        props.loading ?
          <div className="spin-content">加载中</div>
          :
          <>{props.children}</>
      }
    </div>
  )
}

export default Spin