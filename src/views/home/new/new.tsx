import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import { createBaseAlbumList, AlbumBaseClass } from 'UTIL/album'
import './new.less'
import Spin from 'COMPONENTS/spin/spin'
import { genArtists, genSongName, genSongNumber } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { createAddPlaylistSongDialog } from 'COMPONENTS/dialog/create'
import Pagination from 'COMPONENTS/pagination/pagination'

const FILTER_TYPE = {
  '0': '全部',
  '7': '华语',
  '96': '欧美',
  '8': '日本',
  '16': '韩国'
}

const CURRENT_PLAYLIST_PANEL_TAB = {
  song: '新歌速递',
  album: '新碟上架'
}

let offset = 0
let limit = 50

const New: React.SFC = () => {
  const [tab, setTab] = useState('song')
  const [song, setSong] = useState<Song[]>([])
  const [albums, setAlbums] = useState<AlbumBaseClass[]>([])
  const [type, setType] = useState('0')
  const [loading, setLoading] = useState(true)
  const { goArtistDetail, goAlbumDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    return () => {
      offset = 0
    }
  }, [])

  useEffect(() => {
    switch (tab) {
      case 'song':
        getNewSongList()
        break
      case 'album':
        getNewAlbumList()
        break
    }
  }, [tab])

  function selectTab (tab: string) {
    setLoading(true)
    setTab(tab)
  }

  function genContent () {
    switch (tab) {
      case 'song':
        return genSongContent()
      case 'album':
        return genAlbumContent()
    }
  }

  async function getNewSongList () {
    try {
      const params = {
        type: type
      }
      const res = await api.getNewSong(params)
      setSong(createSongList(res.data.data))
      setLoading(false)
    } catch (e) {}
  }

  async function getNewAlbumList () {
    try {
      const params = {
        offset,
        limit
      }
      const res = await api.getNewAlbum(params)
      setAlbums(createBaseAlbumList(res.data.albums))
      setTotal(res.data.total)
      setLoading(false)
    } catch (e) {}
  }

  function setFilterType (type: keyof typeof FILTER_TYPE) {
    setType(type)
  }

  useEffect(() => {
    getNewSongList()
  }, [type])

  function genSongContent () {
    return (
      <ul styleName="newsong">
        {
          song.map((item, index) => (
            <li onDoubleClick={() => { start({ name: '新歌速递页', id: '/home/new' }, item) }} key={item.id} styleName="newsong-item">
              <span>{genSongNumber(index, item, currentSong.song)}</span>
              <span><img styleName="newsong-item-pic" src={item.album.picUrl + '?param=100y100'} alt=""/></span>
              <span>{genSongName(item)}</span>
              <span>{genArtists(item.artists, goArtistDetail, 'commen-link-666666')}</span>
              <span onClick={() => goAlbumDetail(item.album.id)} className="commen-link-666666 active">{item.album.name}</span>
              <span>{item.duration_string}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genAlbumContent () {
    return (
      <div styleName="new-album-container">
        <div className="commen-area-content">
          {
            albums.map(album => (
              <div key={album.id} onClick={() => goAlbumDetail(album.id) } className={`commen-area-item commen-item-album`}>
                <div className="commen-area-img-wrap">
                  <img className="commen-area-img" src={album.picUrl +'?param=250y250'} alt=""/>
                </div>
                <div className="commen-area-text line-more">{album.name}</div>
                <div className="commen-area-artist">{ genArtists(album.artists, goArtistDetail, 'commen-link-666666')}</div>
              </div>
            ))
          }
        </div>
        <div className="pagination-wrap">
          <Pagination total={total} currentPage={currentPage} pageSize={limit} onChange={onAlbumPageChange}></Pagination>
        </div>
      </div>
    )
  }

  function onAlbumPageChange (page: number) {
    setCurrentPage(page)
    offset = (page - 1) * limit
    getNewAlbumList()
  }

  return (
    <div>
      <div styleName="current-playlist-tab">
        {
          (Object.keys(CURRENT_PLAYLIST_PANEL_TAB) as Array<keyof typeof CURRENT_PLAYLIST_PANEL_TAB>).map((key) => (
            <div onClick={() => selectTab(key)} key={key} styleName={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
      <div styleName="new-filter">
        {
          tab === 'song' && (
            <>
              {
                (Object.keys(FILTER_TYPE) as Array<keyof typeof FILTER_TYPE>).map((item) => (
                  <span onClick={() => setFilterType(item)} key={item} styleName={classnames({ 'active': item === type })}>{FILTER_TYPE[item]}</span>
                ))
              }
              <div styleName="new-filter-option">
                <Button onClick={() => { start({ id: '/home/new', name: '每日歌曲推荐' }, song[0], song) }} icon={<Icon name="icon-play"></Icon>} type="primary">播放全部</Button>
                <Button onClick={() => { openAddPlaylistSongDialog({ songs: song, userPlaylist, addOrRemoveSong }) }} icon={<Icon name="icon-add"></Icon>}>添加到歌单</Button>
              </div>
            </>
          )
        }
      </div>
      <Spin loading={loading} delay={0}>
        {
          genContent()
        }
      </Spin>
    </div>
  )
}

export default New