import React, { useEffect, useState } from 'react'
import './toplist.less'
import api from 'API/index'
import PlaylistClass from 'UTIL/playlist'

interface ToplistCls {
  id: number
  coverImgUrl: string
  name: string
  playCount: number
}

//3 1 0 2
const Toplist: React.SFC = () => {
  const [toplist, setToplist] = useState<ToplistCls[]>([])
  const [toplistIndex, setToplistIndex] = useState<PlaylistClass[]>([])

  useEffect(() => {
    getToplist()
    getToplistIndex()
  }, [])

  async function getToplist () {
    try {
      const res = await api.getToplist()
      setToplist(res.data.list)
    } catch (e) {}
  }

  async function getToplistIndex () {
    try {
      const p = [api.getToplistIndex({ idx: '3'}), api.getToplistIndex({ idx: '1'}), api.getToplistIndex({ idx: '0'}), api.getToplistIndex({ idx: '2'})]
      const res = await Promise.all(p)
      setToplistIndex(res.map(item => {
        return new PlaylistClass(item.data.playlist)
      }))
    } catch (e) {}
  }

  return (
    <div className="toplist-container">
      <div className="toplist-netease-wrap">
        <div className="toplist-title">官方榜</div>
        <div>
          {
            toplistIndex.map(playlist => (
              <div key={playlist.id} className="toplist-netease-item">
                <img className="toplist-netease-item-img" src={playlist.coverImgUrl} alt=""/>
                <div className="toplist-netease-item-list">
                  {
                    playlist.tracks.slice(0, 5).map((track, index) => (
                      <div className="toplist-netease-item-list-item" key={track.id}>
                        <span>{index + 1}</span>
                        <span>{track.name}</span>
                        <span>{track.artistName}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <div className="toplist-title">全球榜</div>
        <div className="commen-video-content toplist-world-wrap">
          { toplist.slice(4).map((item) => (
              <div key={item.id} className="commen-video-item commen-video-item-medium">
                <div className="commen-video-img-wrap">
                  <div className="commen-video-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <div className="commen-video-playcount"><i className="iconfont icon-triangle"></i>{item.playCount > 100000 ? `${Math.round(item.playCount/10000)}万` : item.playCount}</div>
                  <img src={item.coverImgUrl+'?param=250y250'} alt=""/>
                </div>
                <div className="commen-video-text">{item.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
export default Toplist