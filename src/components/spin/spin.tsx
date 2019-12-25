import React, { useState, useEffect } from 'react'
import './spin.less'

interface SpinProps {
  children: React.ReactNodeArray
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
    <div className="spin-container">
      {
        spin ?
          <div className="spin-content">
            <div className="spinner">
              <div className="spinner-loading">
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
              </div>
            </div>
            <span>加载中</span>
          </div>
          :
          <>{props.children}</>
      }
    </div>
  )
}

export default Spin