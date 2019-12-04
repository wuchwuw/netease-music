import React, { useEffect } from 'react'
import './music-list.less'

const MusicList: React.SFC = (props: any) => {
  console.log(props)
  useEffect(() => {
    console.log(props)
  })
  function getTime (time: any) {
    time = (time / 1000).toFixed(0)
    let min = Math.floor(time / 60)
    let s = time - min * 60
    function padZero(n) {
      return n <= 9 ? `0${n}` : n
    }
    return `${padZero(min)}:${padZero(s)}`
  }
  return (
    <ul className="music-list">
      <li className="music-list-item">
        <div></div>
        <div>音乐标题</div>
        <div>歌手</div>
        <div>专辑</div>
        <div>时长</div>
      </li>
      {
        props.list.map((item: any, index: any) => (
          <li key={item.al.id} className="music-list-item">
            <div className="music-list-item-action">
              <span>01</span>
              <i className="iconfont iconxin"></i>
            </div>
            <div>
              <div className="text-overflow" title={item.name}>{item.name}</div>
            </div>
            <div>
              <div className="text-overflow" title={item.ar[0].name}>{item.ar[0].name}</div>
            </div>
            <div>
              <div className="text-overflow" title={item.al.name}>{item.al.name}</div>
            </div>
            <div>
            <div className="text-overflow">{getTime(item.dt)}</div>
            </div>
          </li>
        ))
      }
    </ul>
  )
}

export default MusicList