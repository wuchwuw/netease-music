import React, { useState, useEffect, useMemo, useCallback } from 'react'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import Comment from 'COMPONENTS/comment/comment'
import { Map, Collection } from 'immutable'
import './fm.less'

let FMList: Song[] = []

const FM = () => {
  const [fm, setFM] = useState<Song>(new Song({}))
  const [lyric, setLyric] = useState({})
  const CommentComponent = useMemo(() => <Comment type="music" id={fm.id} />, [fm])

  useEffect(() => {
    getFM()
  }, [])

  async function getFM () {
    try {
      const res = await api.getFM()
      FMList = createSongList(res.data.data)
      FMList[0].getLyric((lyric: any) => {
        setLyric(lyric)
      })
      setFM(FMList[0])
    } catch (e) {}
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-cover">
          <div className="fm-song-cover-current">
            <img src={fm.picUrl} alt=""/>
          </div>
          <div className="fm-song-cover-prev"></div>
        </div>
        <div className="fm-info">
          <div className="fm-info-name">{fm.name}</div>
          <div className="fm-info-album">
            <div>专辑:<span>{fm.albumName}</span></div>
            <div>歌手:<span>{fm.artistName}</span></div>
          </div>
          <div className="fm-info-lyrics">
            {
              lyric.lines && lyric.lines.map((item: any, index: any) => (
                <p key={index} className="fm-info-lyrics-item">{item.txt}</p>
              ))
            }
          </div>
        </div>
      </div>
      { CommentComponent }
    </div>
  )
}

export default FM