import React, { useState, useEffect, useMemo } from 'react'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import Comment from 'COMPONENTS/comment/comment'
import './fm.less'

let FMList: Song[] = []

const FM = () => {
  const [fm, setFM] = useState<Song>(new Song({}))
  const CommentComponent = useMemo(() => <Comment type="music" id={fm.id} />, [fm.id]);

  useEffect(() => {
    getFM()
  }, [])

  useEffect(() => {
    fm.getLyric()
  }, [fm])

  async function getFM () {
    try {
      const res = await api.getFM()
      FMList = createSongList(res.data.data)
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
        <div className="player-info">
          <div className="player-info-name">{fm.name}</div>
          <div className="player-info-album">
            <div>专辑:<span>{fm.albumName}</span></div>
            <div>歌手:<span>{fm.artistName}</span></div>
          </div>
          <div className="player-info-lyrics">
            {
              fm.lyric && fm.lyric.lines.map((item: any, index: any) => (
                <p key={index} className="player-info-lyrics-item">{item.txt}</p>
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