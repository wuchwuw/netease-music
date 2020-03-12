import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import { createBaseAlbumList, AlbumBaseClass } from 'UTIL/album'
import './new.less'
import Spin from 'COMPONENTS/spin/spin'

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

const New: React.SFC = () => {
  const [tab, setTab] = useState('song')
  const [song, setSong] = useState<Song[]>([])
  const [album, setAlbum] = useState<AlbumBaseClass[]>([])
  const [type, setType] = useState('0')
  const [loading, setLoading] = useState(true)

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
      setLoading(true)
      const params = {
        type: type
      }
      const res = await api.getNewSong(params)
      setSong(createSongList(res.data.data))
    } catch (e) {}
    finally {
      setLoading(false)
    }
  }

  async function getNewAlbumList () {
    try {
      setLoading(true)
      const params = {
        type: 0
      }
      const res = await api.getNewAlbum(params)
      setAlbum(createBaseAlbumList(res.data.albums))
    } catch (e) {}
    finally {
      setLoading(false)
    }
  }

  function setFilterType (type) {
    setType(type)
  }

  useEffect(() => {
    getNewSongList()
  }, [type])

  function genSongContent () {
    return (
      <ul className="newsong">
        {
          song.map((item, index) => (
            <li key={item.id} className="newsong-item">
              <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
              <span><img className="newsong-item-pic" src={item.picUrl + '?param=60y60'} alt=""/></span>
              <span>{item.name}</span>
              <span>{item.artistName}</span>
              <span>{item.albumName}</span>
              <span>{item.duration_string}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genAlbumContent () {
    return (
      <div className="newalbum">
        {
          album.map(item => (
            <div key={item.id} className="commen-area-item commen-area-item-album">
              <div className="commen-area-img-wrap">
              <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <img src={item.picUrl + '?param=130y130'} alt=""/>
              </div>
              <div className="commen-area-text">{item.name}</div>
              <div className="commen-area-artist">{item.artistName}</div>
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div className="container">
      <div className="current-playlist-tab">
        {
          (Object.keys(CURRENT_PLAYLIST_PANEL_TAB) as Array<keyof typeof CURRENT_PLAYLIST_PANEL_TAB>).map((key) => (
            <div onClick={() => selectTab(key)} key={key} className={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
      <div className="new-filter">
        {
          tab === 'song' &&
          (Object.keys(FILTER_TYPE) as Array<keyof typeof FILTER_TYPE>).map((item) => (
            <span onClick={() => setFilterType(item)} key={item} className={classnames({ 'active': item === type })}>{FILTER_TYPE[item]}</span>
          ))
        }
      </div>
      <Spin loading={loading} delay={300}>
        {
          genContent()
        }
      </Spin>
    </div>
  )
}

export default New