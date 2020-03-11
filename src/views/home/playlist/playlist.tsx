import React, { useState, useEffect } from 'react'
import './playlist.less'
import api from 'API/index'
import classnames from 'classnames'

const HomeAlbum: React.SFC = () => {
  const [top, setTop] = useState([])
  const [hotCate, setHotCate] = useState<string[]>([])
  const [highquality, setHighquality] = useState({})
  const [currentCate, setCurrentCate] = useState<string>('全部')
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
        limit: 100,
        order: 'hot'
      }
      const res = await api.getTopList(params)
      setTop(res.data.playlists)
    } catch (e) {}
  }
  async function getHotCate () {
    try {
      const res = await api.getPlaylistHotCate()
      const tags = res.data.tags
      const cate = tags.map((item: any) => item.playlistTag)
      setHotCate(cate)
    } catch (e) {}
  }
  async function getHighquality () {
    try {
      const params = { cate: currentCate, limit: 1 }
      const res = await api.getPlaylistHighquality(params)
      res.data.playlists.length && setHighquality(res.data.playlists[0])
    } catch (e) {}
  }
  return (
    <div className="container home-wrap">
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
          <div className="home-album-hot-btn">精品歌单</div>
          <div className="home-album-hot-name">{highquality.name}</div>
          <div className="home-album-hot-des">{highquality.copywriter}</div>
        </div>
      </div>
      <div className="home-album-filter">
        <div className="home-album-filter-btn">全部歌单<i className="iconfont icon-arrow"></i></div>
        <div className="home-album-filter">
          {
            hotCate.map(cate => (
              <span className={classnames('home-album-filter-item', {'active': currentCate.name === cate.name})} key={cate.id}>{cate.name}</span>
            ))
          }
        </div>
      </div>
      <div className="home-album-content">
        { top.map((item: any, index) => (
            <div key={index} className="home-album-item">
              <img className="home-album-img" src={item.coverImgUrl} alt=""/>
              <div className="home-album-text">{item.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default HomeAlbum