import React, { useState, useEffect } from 'react'
import './playlist.less'
import api from 'API/index'
import classnames from 'classnames'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import { usePageForword } from 'ROUTER/hooks'
import LoadMore from 'COMPONENTS/load-more/load-more'

interface PlaylistHighQuality {
  coverImgUrl: string
  name: string
  copywriter: string
}

interface PlaylistCate {
  name: string,
  hot: boolean
  id: number
}

const PLAYLIST_PAGESIZE = 60

const HomeAlbum: React.SFC = () => {
  const [top, setTop] = useState<PlaylistClass[]>([])
  const [hotCate, setHotCate] = useState<PlaylistCate[]>([])
  const [highquality, setHighquality] = useState<PlaylistHighQuality>({} as PlaylistHighQuality)
  const [currentCate, setCurrentCate] = useState<string>('全部')
  const { goPlaylistDetail } = usePageForword()
  const [total, setTotal] = useState(0)
  useEffect(() => {
    getTopList()
    getHighquality()
  }, [currentCate])

  useEffect(() => {
    getHotCate()
  }, [])

  async function getTopList () {
    try {
      const params = {
        limit: PLAYLIST_PAGESIZE,
        order: 'hot',
        cat: currentCate
      }
      const res = await api.getTopList(params)
      setTop(createPlaylistList(res.data.playlists))
      setTotal(res.data.total)
    } catch (e) {}
  }

  async function getHotCate () {
    try {
      const res = await api.getPlaylistHotCate()
      setHotCate(res.data.tags)
    } catch (e) {}
  }

  async function getHighquality () {
    try {
      const params = { cat: currentCate, limit: 1 }
      const res = await api.getPlaylistHighquality(params)
      setHighquality(res.data.playlists[0] || {})
    } catch (e) {}
  }

  return (
    <LoadMore>
      <div className="playlist-container">
        <div className="home-album-hot" >
          <div
            className="home-album-hot-bg"
            style={{
              background: `url('${highquality.coverImgUrl}')`,
              backgroundPosition: 'center',
              filter: 'blur(40px)'
            }}
          ></div>
          <img src={highquality.coverImgUrl} className="home-album-hot-img" />
          <div className="home-album-hot-info">
            <div className="home-album-hot-btn"><i className="iconfont icon-vip"></i>精品歌单</div>
            <div className="home-album-hot-name">{highquality.name}</div>
            <div className="home-album-hot-des">{highquality.copywriter}</div>
          </div>
        </div>
        <div className="home-album-filter">
          <div className="home-album-filter-btn">全部歌单<i className="iconfont icon-arrow"></i></div>
          <div className="home-album-filter">
            {
              hotCate.map(cate => (
                <span onClick={() => { setCurrentCate(cate.name) }} className={classnames('home-album-filter-item', {'active': currentCate === cate.name})} key={cate.id}>{cate.name}</span>
              ))
            }
          </div>
        </div>
        <div className="commen-area-content">
          { top.map((item, index) => (
              <div onClick={() => { goPlaylistDetail(item.id) }} key={item.id} className="commen-area-item commen-area-item-playlist">
                <div className="commen-area-img-wrap">
                  <img src={item.coverImgUrl} alt=""/>
                  <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
                  <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <div className="commen-area-user"><i className="iconfont icon-user"></i>{item.creator.nickname}</div>
                </div>   
                <div className="home-album-text">{item.name}</div>
              </div>
            ))
          }
        </div>
      </div>
    </LoadMore>
  )
}

export default HomeAlbum