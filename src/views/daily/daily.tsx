import React, { useEffect, useState } from 'react'
import './daily.less'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import MusicList from 'COMPONENTS/music-list/music-list'
import { useSongContextMenu } from 'UTIL/menu'
import { usePlayerController } from 'UTIL/player-controller'
import Button from 'COMPONENTS/button/button'

const Daily = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const { getSongMenu } = useSongContextMenu()
  const { start } = usePlayerController()

  useEffect(() => {
    getRecomendSong()
  }, [])

  function getMenu (song: Song) {
    return getSongMenu({ id: 'daily', name: '每日歌曲推荐' }, song)
  }

  async function getRecomendSong () {
    try {
      const res = await api.getRecomendSong()
      setSongs(createSongList(res.data.recommend))
    } catch (e) {}
  }

  function musiclistStart (song: Song) {
    start({ id: 'daily', name: '每日歌曲推荐' }, song, songs)
  }

  return (
    <div>
      <div>
        <div>
          <i className="iconfont icon-date"></i>
        </div>
        <div>
          <div>每日歌曲推荐</div>
          <div>根据你的音乐口味生成，每天6:00更新</div>
        </div>
      </div>
      <div>
        <Button type="primary">播放全部</Button>
        <Button>收藏全部</Button>
      </div>
      <MusicList start={musiclistStart} list={songs} getMenu={getMenu} ></MusicList>
    </div>
  )
}

export default Daily