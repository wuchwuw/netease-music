import React, { useEffect, useState } from 'react'
import './toplist.less'
import api from 'API/index'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import Spin from 'COMPONENTS/spin/spin'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import Icon from 'COMPONENTS/icon/icon'
import { genArtists, genSongName } from 'VIEWS/template/template'
import { usePlayerController } from 'UTIL/player-controller'

let ToplistIndexCache: PlaylistClass[] = []
let ToplistCache: PlaylistClass[] = []

const Toplist: React.SFC = () => {
  const [toplist, setToplist] = useState<PlaylistClass[]>([])
  const [toplistIndex, setToplistIndex] = useState<PlaylistClass[]>([])
  const [toplistLoading, setToplistLoading] = useState(false)
  const { goPlaylistDetail, goArtistDetail } = usePageForword()
  const { start } = usePlayerController()

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
      const p = [api.getToplistIndex({ id: 19723756 }), api.getToplistIndex({ id: 3779629}), api.getToplistIndex({ id: 2884035 }), api.getToplistIndex({ id: 3778678})]
      const res = await Promise.all(p)
      setToplistIndex(ToplistIndexCache = res.map(item => {
        return new PlaylistClass(item.data.playlist)
      }))
      setToplistLoading(false)
    } catch (e) {}
  }

  return (
    <div styleName="toplist-container">
      <div styleName="toplist-netease-wrap">
        <div styleName="toplist-title">官方榜</div>
        <Spin loading={toplistLoading} delay={300}>
          {
            toplistIndex.map(playlist => (
              <div key={playlist.id} styleName="toplist-netease-item">
                <img onClick={() => { goPlaylistDetail(playlist.id) }} styleName="toplist-netease-item-img" src={playlist.coverImgUrl} alt=""/>
                <div styleName="toplist-netease-item-list">
                  {
                    playlist.tracks.slice(0, 5).map((track, index) => (
                      <div onDoubleClick={() => start({ name: playlist.name, id: `/playlist${playlist.id}` }, track, playlist.tracks)} styleName="toplist-netease-item-list-item" key={track.id}>
                        <span styleName={classNames({'active': index <= 2})}>{index + 1}</span>
                        <span>{genSongName(track)}</span>
                        <span className="text-overflow">{genArtists(track.artists, goArtistDetail, 'commen-link-666666')}</span>
                      </div>
                    ))
                  }
                  <div styleName="toplist-netease-item-more">
                    <span onClick={() => { goPlaylistDetail(playlist.id) }}>查看全部<Icon name="icon-arrow-right"></Icon></span>
                  </div>
                </div>
              </div>
            ))
          }
        </Spin>
      </div>
      <div>
        <div styleName="toplist-title">全球榜</div>
        <div className="commen-area-content toplist-world-wrap">
          { toplist.slice(4).map(playlist => (
              <div key={playlist.id} className="commen-area-item commen-area-item-medium">
                <div onClick={() => { goPlaylistDetail(playlist.id) }} className="commen-area-img-wrap">
                  <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                  <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{playlist.playCount_string}</div>
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