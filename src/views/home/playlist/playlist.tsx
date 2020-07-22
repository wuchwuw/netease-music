import React, { useState, useEffect } from 'react'
import './playlist.less'
import api from 'API/index'
import classnames from 'classnames'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import { usePageForword, getQueryStringValue, setQueryStringValue } from 'ROUTER/hooks'
import Pagination from 'COMPONENTS/pagination/pagination'
import { useContainer } from 'COMPONENTS/container/container'
import { useHistory, useLocation } from 'react-router'
import Icon from 'COMPONENTS/icon/icon'

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
let firstRender = true

const HomeAlbum: React.SFC = () => {
  const [top, setTop] = useState<PlaylistClass[]>([])
  const [hotCate, setHotCate] = useState<PlaylistCate[]>([])
  const [highquality, setHighquality] = useState<PlaylistHighQuality>({} as PlaylistHighQuality)
  const [currentCate, setCurrentCate] = useState<string>(getQueryStringValue().cate || '全部')
  const { goPlaylistDetail, goUserDetail } = usePageForword()
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { open, visible } = useContainer(['#home-album-filter-btn'])
  const [allCate, setAllCate] = useState<AllCate[]>([])
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    getTopList(1)
    setCurrentPage(1)
    getHighquality()
  }, [currentCate])

  useEffect(() => {
    getHotCate()
    getAllCate()
  }, [])

  useEffect(() => {
    if (!firstRender) {
      const query = getQueryStringValue()
      setCurrentCate(query.cate || '全部')
    }
    firstRender = false
  }, [location.search])

  function setCate (value: string) {
    setQueryStringValue({ cate: value }, history)
  }

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
    <div styleName="playlist-container">
      {
        highquality.name && (
          <div styleName="home-album-hot" >
            <div
              styleName="home-album-hot-bg"
              style={{
                background: `url('${highquality.coverImgUrl}')`,
                backgroundPosition: 'center',
                filter: 'blur(40px)'
              }}
            >
            </div>
            <img src={highquality.coverImgUrl} styleName="home-album-hot-img" />
            <div styleName="home-album-hot-info">
              <div styleName="home-album-hot-btn"><Icon name="icon-vip"></Icon>精品歌单</div>
              <div styleName="home-album-hot-name">{highquality.name}</div>
              <div styleName="home-album-hot-des">{highquality.copywriter}</div>
            </div>
          </div>
        )
      }
      <div styleName="home-album-filter">
        <div styleName="home-album-filter-btn-wrap">
          <div id="home-album-filter-btn" styleName="home-album-filter-btn" onClick={open}>
            {currentCate}<Icon name="icon-arrow-right"></Icon>
          </div>
          {
            visible && (
              <div styleName="playlist-cate">
                <div styleName="playlist-cate-all" onClick={() => { setCate('全部') }}>全部歌单</div>
                {
                  allCate.map(item => (
                    <div styleName="playlist-cate-item">
                      <span styleName="playlist-cate-label">{item.cate}</span>
                      <div styleName="playlist-cate-wrap">
                        {
                          item.sub.map(s => (
                            <span onClick={() => { setCate(s.name) }} styleName={classnames({ 'active': currentCate === s.name})}>{s.name}</span>
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
        <div styleName="home-album-filter">
          {
            hotCate.map(cate => (
              <span onClick={() => { setCate(cate.name) }} styleName={classnames('home-album-filter-item', {'active': currentCate === cate.name})} key={cate.id}>{cate.name}</span>
            ))
          }
        </div>
      </div>
      <div className="commen-area-content">
        { top.map((item) => (
            <div onClick={() => { goPlaylistDetail(item.id, item) }} key={item.id} className="commen-area-item commen-area-item-playlist-170">
              <div className="commen-area-img-wrap">
                <img src={item.coverImgUrl} alt=""/>
                <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{item.playCount_string}</div>
                <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                <div className="commen-area-user" onClick={(e) => { e.stopPropagation(); goUserDetail(item.creator.userId) }}><Icon name="icon-user"></Icon>{item.creator.nickname}</div>
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