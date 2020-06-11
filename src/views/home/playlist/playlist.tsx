import React, { useState, useEffect } from 'react'
import './playlist.less'
import api from 'API/index'
import classnames from 'classnames'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import { usePageForword, getQueryStringValue, setQueryStringValue } from 'ROUTER/hooks'
import Pagination from 'COMPONENTS/pagination/pagination'
import { useContainer } from 'COMPONENTS/container/container'
import { useHistory } from 'react-router'

interface PlaylistHighQuality {
  coverImgUrl: string
  name: string
  copywriter: string
}

interface AllCate {
  cate: string,
  sub: PlaylistCate[]
}

interface PlaylistCate {
  name: string,
  hot: boolean
  id: number
}

const PLAYLIST_PAGESIZE = 36

const HomeAlbum: React.SFC = () => {
  const [top, setTop] = useState<PlaylistClass[]>([])
  const [hotCate, setHotCate] = useState<PlaylistCate[]>([])
  const [highquality, setHighquality] = useState<PlaylistHighQuality>({} as PlaylistHighQuality)
  const cate = getQueryStringValue().cate || '全部'
  const [currentCate, setCurrentCate] = useState<string>(cate)
  const { goPlaylistDetail, goUserDetail } = usePageForword()
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { open, visiable } = useContainer(['.home-album-filter-btn'])
  const [allCate, setAllCate] = useState<AllCate[]>([])
  const history = useHistory()

  useEffect(() => {
    getTopList(1)
    setCurrentPage(1)
    getHighquality()
    setQueryStringValue({ cate: currentCate }, history)
  }, [currentCate])

  useEffect(() => {
    setCurrentCate(cate)
  }, [cate])

  useEffect(() => {
    getHotCate()
    getAllCate()
  }, [])

  async function getTopList (page: number) {
    try {
      const params = {
        limit: PLAYLIST_PAGESIZE,
        order: 'hot',
        cat: currentCate,
        offset: (page - 1) * PLAYLIST_PAGESIZE
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

  async function getAllCate () {
    try {
      const res = await api.getPlaylistAllCate()
      const cate = Object.keys(res.data.categories).map(key => {
        return {
          cate: res.data.categories[key],
          sub: res.data.sub.filter((item: any) => item.category === Number(key))
        }
      })
      setAllCate(cate)
    } catch (e) {}
  }

  async function getHighquality () {
    try {
      const params = { cat: currentCate, limit: 1 }
      const res = await api.getPlaylistHighquality(params)
      setHighquality(res.data.playlists[0] || {})
    } catch (e) {}
  }

  function onPageChange (page: number) {
    getTopList(page)
    setCurrentPage(page)
  }

  return (
    <div className="playlist-container">
      {
        highquality.name && (
          <div className="home-album-hot" >
            <div
              className="home-album-hot-bg"
              style={{
                background: `url('${highquality.coverImgUrl}')`,
                backgroundPosition: 'center',
                filter: 'blur(40px)'
              }}
            >
            </div>
            <img src={highquality.coverImgUrl} className="home-album-hot-img" />
            <div className="home-album-hot-info">
              <div className="home-album-hot-btn"><i className="iconfont icon-vip"></i>精品歌单</div>
              <div className="home-album-hot-name">{highquality.name}</div>
              <div className="home-album-hot-des">{highquality.copywriter}</div>
            </div>
          </div>
        )
      }
      <div className="home-album-filter">
        <div className="home-album-filter-btn-wrap">
          <div className="home-album-filter-btn" onClick={open}>
            {currentCate}<i className="iconfont icon-arrow-right"></i>
          </div>
          {
            visiable && (
              <div className="playlist-cate">
                <div className="playlist-cate-all" onClick={() => { setCurrentCate('全部') }}>全部歌单</div>
                {
                  allCate.map(item => (
                    <div className="playlist-cate-item">
                      <span className="playlist-cate-label">{item.cate}</span>
                      <div className="playlist-cate-wrap">
                        {
                          item.sub.map(s => (
                            <span onClick={() => { setCurrentCate(s.name) }} className={classnames({ 'active': currentCate === s.name})}>{s.name}</span>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
        <div className="home-album-filter">
          {
            hotCate.map(cate => (
              <span onClick={() => { setCurrentCate(cate.name) }} className={classnames('home-album-filter-item', {'active': currentCate === cate.name})} key={cate.id}>{cate.name}</span>
            ))
          }
        </div>
      </div>
      <div className="commen-area-content">
        { top.map((item) => (
            <div onClick={() => { goPlaylistDetail(item.id, item) }} key={item.id} className="commen-area-item commen-area-item-playlist">
              <div className="commen-area-img-wrap">
                <img src={item.coverImgUrl} alt=""/>
                <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
                <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <div className="commen-area-user" onClick={(e) => { e.stopPropagation(); goUserDetail(item.creator.userId) }}><i className="iconfont icon-user"></i>{item.creator.nickname}</div>
              </div>
              <div className="commen-area-text">{item.name}</div>
            </div>
          ))
        }
      </div>
      { total > 0 && <Pagination currentPage={currentPage} total={total} pageSize={PLAYLIST_PAGESIZE} onChange={onPageChange}></Pagination> }
    </div>
  )
}

export default HomeAlbum