import React, { useState, useEffect, useMemo } from 'react'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'
import { FMType } from 'STORE/player/types'

let FM_TYPE = ['current', 'next', 'prev', 'remove', 'delete']

function fmSongSource () {
  return {
    id: 'fm',
    name: '私人FM'
  }
}

const FM = () => {
  const [lyric, setLyric] = useState({})
  const { startFM, initFM, fmScreenMusicList } = usePlayerController()
  const [screenList, setScreenList] = useState(FM_TYPE.map(item => { return { song: new Song({}), type: item } }))
  const CommentComponent = useMemo(() => <Comment showTitle={true} type="music" id={fmScreenMusicList.current.song.id} />, [fmScreenMusicList.current.song.id])

  useEffect(() => {
    initFM()
  }, [])

  useEffect(() => {
    if (fmScreenMusicList.current.song.id) {
      getFMLyric()
    }
  }, [fmScreenMusicList.current.song.id])

  function getFMLyric () {
    fmScreenMusicList.current.song.getLyric((lyric: any) => {
      setLyric(lyric)
    })
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-cover">
          {
            (Object.keys(fmScreenMusicList) as (FMType)[]).map((key) => (
              <div key={fmScreenMusicList[key].song.id} className={`fm-song-cover-content ${key}`}>
                <img src={fmScreenMusicList[key].song.album.picUrl + '?param=500y500'} alt=""/>
              </div>
            ))
          }
          <div onClick={() => { startFM() }} className="fm-play-icon pause"><i className="iconfont icon-triangle-full"></i></div>
        </div>
        <div className="fm-info">
          <div className="fm-info-name">{fmScreenMusicList.current.song.name}</div>
          <div className="fm-info-album">
            <div>专辑:<span className="commen-link-blue">{fmScreenMusicList.current.song.album.name}</span></div>
            <div>歌手:<span className="commen-link-blue">{fmScreenMusicList.current.song.artistName}</span></div>
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