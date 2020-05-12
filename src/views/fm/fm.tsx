import React, { useState, useEffect, useMemo } from 'react'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'

let FMList: Song[] = []
let FM_TYPE = ['current', 'next', 'prev', 'remove', 'delete']

function fmSongSource () {
  return {
    id: 'fm',
    name: '私人FM'
  }
}

const FM = () => {
  const [fmList, setFMList] = useState<Song[]>([])
  const [lyric, setLyric] = useState({})
  const { startFM, currentSong, initFM, fmScreenMusicList } = usePlayerController()
  const [screenList, setScreenList] = useState(FM_TYPE.map(item => { return { song: new Song({}), type: item } }))
  const [fm, setFM] = useState<Song>((fmScreenMusicList.find(item => item.type === 'current')!.song!.song))
  const CommentComponent = useMemo(() => <Comment showTitle={true} type="music" id={fm.id} />, [fm])

  useEffect(() => {
    initFM()
  }, [])

  useEffect(() => {
    if (fm.id) {
      getFMLyric()
    }
  }, [fm.id])

  // useEffect(() => {
  //   if (fm.id) {
  //     setFM((fmScreenMusicList.find(item => item.type === 'current')!.song!.song))
  //   }
  // }, [currentSong.song.id])

  async function getFM () {
    try {
      const res = await api.getFM()
      FMList = createSongList(res.data.data)
      setFM(FMList[0])
      setFMList(FMList)
      screenList[0].song = FMList[0]
      screenList[1].song = FMList[1]
      setScreenList([...screenList])
    } catch (e) {
      console.log(e)
    }
  }

  function getFMLyric () {
    fm.getLyric((lyric: any) => {
      setLyric(lyric)
    })
  }

  function aaaa () {
    screenList[0].type = 'prev'
    screenList[1].type = 'current'
    setScreenList([...screenList])
    console.log(screenList)
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-cover">
          {
            fmScreenMusicList.map(item => (
              <div key={item.song.song.id} className={`fm-song-cover-content ${item.type}`}>
                <img src={item.song.song.album.picUrl + '?param=500y500'} alt=""/>
              </div>
            ))
          }
          <div className="fm-play-icon pause"><i className="iconfont icon-triangle-full"></i></div>
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