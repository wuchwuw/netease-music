import React, { useEffect, useState } from 'react'
import './toplist.less'
import api from 'API/index'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import Spin from 'COMPONENTS/spin/spin'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import Song from 'UTIL/song'

let ToplistIndexCache: PlaylistClass[] = []
let ToplistCache: PlaylistClass[] = []

const Toplist: React.SFC = () => {
  const [toplist, setToplist] = useState<PlaylistClass[]>([])
  const [toplistIndex, setToplistIndex] = useState<PlaylistClass[]>([])
  const [toplistLoading, setToplistLoading] = useState(false)
  const { goPlaylistDetail, goArtistDetail } = usePageForword()

  useEffect(() => {
    if (ToplistIndexCache.length && ToplistCache.length) {
      setToplist(ToplistCache)
      setToplistIndex(ToplistIndexCache)
    } else {
      getToplistIndex()
      getToplist()
    }
  }, [])

  async function getToplist () {
    try {
      const res = await api.getToplist()
      setToplist(ToplistCache = createPlaylistList(res.data.list))
    } catch (e) {}
  }

  async function getToplistIndex () {
    try {
      setToplistLoading(true)
      const p = [api.getToplistIndex({ idx: '3'}), api.getToplistIndex({ idx: '0'}), api.getToplistIndex({ idx: '2'}), api.getToplistIndex({ idx: '1'})]
      const res = await Promise.all(p)
      setToplistIndex(ToplistIndexCache = res.map(item => {
        return new PlaylistClass(item.data.playlist)
      }))
      setToplistLoading(false)
    } catch (e) {}
  }

  function genArtist (song: Song) {
    let artists = song.artists
    let ret: React.ReactNodeArray = []
    artists.forEach((item, index) => {
      ret.push(<span onClick={() => { goArtistDetail(item.id) }}>{item.name}</span>)
      if (index !== artists.length - 1) {
        ret.push('/')
      }
    })
    return ret
  }

  return (
    <div className="toplist-container">
      <div className="toplist-netease-wrap">
        <div className="toplist-title">官方榜</div>
        <Spin loading={toplistLoading} delay={300}>
          {
            toplistIndex.map(playlist => (
              <div key={playlist.id} className="toplist-netease-item">
                <img onClick={() => { goPlaylistDetail(playlist.id) }} className="toplist-netease-item-img" src={playlist.coverImgUrl} alt=""/>
                <div className="toplist-netease-item-list">
                  {
                    playlist.tracks.slice(0, 5).map((track, index) => (
                      <div className="toplist-netease-item-list-item" key={track.id}>
                        <span className={classNames({'active': index <= 2})}>{index + 1}</span>
                        <span>{track.name}</span>
                        <span>{genArtist(track)}</span>
                      </div>
                    ))
                  }
                  <div className="toplist-netease-item-more">
                    <span onClick={() => { goPlaylistDetail(playlist.id) }}>查看全部<i className="iconfont icon-arrow-right"></i></span>
                  </div>
                </div>
              </div>
            ))
          }
        </Spin>
      </div>
      <div>
        <div className="toplist-title">全球榜</div>
        <div className="commen-area-content toplist-world-wrap">
          { toplist.slice(4).map(playlist => (
              <div key={playlist.id} className="commen-area-item commen-area-item-medium">
                <div onClick={() => { goPlaylistDetail(playlist.id) }} className="commen-area-img-wrap">
                  <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{playlist.playCount_string}</div>
                  <img src={playlist.coverImgUrl+'?param=250y250'} alt=""/>
                </div>
                <div className="commen-area-text">{playlist.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
export default Toplist