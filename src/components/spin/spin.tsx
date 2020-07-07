import React, { useState, useEffect } from 'react'
import './spin.less'
import Loading from 'COMPONENTS/loading/loading'

interface SpinProps {
  children: React.ReactNode
  loading: boolean
  delay: number
}

const Spin: React.SFC<SpinProps> = (props) => {
  const [spin, setSpin] = useState(props.loading)
  const shouldDely = !!props.delay
  useEffect(() => {
    if (props.loading) {
      setSpin(props.loading)
    } else {
      if (shouldDely) {
        setTimeout(() => {
          setSpin(props.loading)
        }, props.delay)
      } else {
        setSpin(props.loading)
      }
    }
  }, [props.loading])
  return (
    <div>
      {
        spin ?
          <div styleName="spin-content">
            <Loading></Loading>
            <span styleName="spin-text">加载中</span>
          </div>
          :
          <>{props.children}</>
      }
    </div>
  )
}

export default Spin