import React, { useState, useEffect, useMemo, useCallback } from 'react'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'

let FMList: Song[] = []

const FM = () => {
  const [fm, setFM] = useState<Song>(new Song({}))
  const [fmList, setFMList] = useState<Song[]>([])
  const [lyric, setLyric] = useState({})
  const CommentComponent = useMemo(() => <Comment showTitle={true} type="music" id={fm.id} />, [fm])
  const { start, currentSong } = usePlayerController()

  useEffect(() => {
    getFM()
  }, [])

  useEffect(() => {
    if (fm.id) {
      getFMLyric()
    }
  }, [fm.id])

  useEffect(() => {
    if (fm.id) {
      setFM(currentSong)
    }
  }, [currentSong.id])

  async function getFM () {
    try {
      const res = await api.getFM()
      FMList = createSongList(res.data.data)
      setFM(FMList[0])
      setFMList(FMList)
    } catch (e) {}
  }
  
  function getFMLyric () {
    fm.getLyric((lyric: any) => {
      setLyric(lyric)
    })
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-cover">
          <div className="fm-song-cover-current">
            <img onClick={() => { start(fm, fmList) }} src={fm.picUrl} alt=""/>
          </div>
          <div className="fm-song-cover-prev"></div>
        </div>
        <div className="fm-info">
          <div className="fm-info-name">{fm.name}</div>
          <div className="fm-info-album">
            <div>专辑:<span className="commen-link-blue">{fm.album.name}</span></div>
            <div>歌手:<span className="commen-link-blue">{fm.artistName}</span></div>
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