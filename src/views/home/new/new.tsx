import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import { createBaseAlbumList, AlbumBaseClass } from 'UTIL/album'
import './new.less'

const New: React.SFC = () => {
  const [tab, setTab] = useState('song')
  const [song, setSong] = useState<Song[]>([])
  const [album, setAlbum] = useState<AlbumBaseClass[]>([])
  const CURRENT_PLAYLIST_PANEL_TAB = {
    song: '新歌速递',
    album: '新碟上架'
  }

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
      const params = {
        type: 0
      }
      const res = await api.getNewSong(params)
      setSong(createSongList(res.data.data))
    } catch (e) {}
  }

  async function getNewAlbumList () {
    try {
      const params = {
        type: 0
      }
      const res = await api.getNewAlbum(params)
      setAlbum(createBaseAlbumList(res.data.albums))
    } catch (e) {}
  }

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
            <div key={item.id} className="newalbum-item">
              <img className="newalbum-item-pic" src={item.picUrl + '?param=130y130'} alt=""/>
              <div>{item.name}</div>
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
        <span>全部</span>
        <span>华语</span>
        <span>欧美</span>
        <span>韩国</span>
        <span>日本</span>
      </div>
      <div>
        {
          genContent()
        }
      </div>
    </div>
  )
}

export default New