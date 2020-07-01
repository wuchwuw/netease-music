import React, { useEffect, useState } from 'react'
import './daily.less'
import api from 'API/index'
import Song, { createSongList } from 'UTIL/song'
import MusicList from 'COMPONENTS/music-list/music-list'
import { useSongContextMenu } from 'UTIL/menu'
import { usePlayerController } from 'UTIL/player-controller'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import { createAddPlaylistSongDialog } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from 'UTIL/user-playlist'

const Daily = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const { getSongMenu } = useSongContextMenu()
  const { start } = usePlayerController()
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()

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
    start({ id: '/daily', name: '每日歌曲推荐' }, song, songs)
  }

  return (
    <div styleName="daily-container">
      <div styleName="daily-text">
        <div styleName="daily-text-icon">
          <div styleName="daily-text-day">星期{(['日', '一', '二', '三', '四', '五', '六'])[(new Date).getDay()]}</div>
          <div styleName="daily-text-date">{(new Date).getDate()}</div>
        </div>
        <div styleName="daily-text-tip">
          <div>每日歌曲推荐</div>
          <div>根据你的音乐口味生成，每天6:00更新</div>
        </div>
      </div>
      <div styleName="daily-option">
        <Button onClick={() => { start({ id: '/daily', name: '每日歌曲推荐' }, songs[0], songs) }} icon={<Icon name="icon-play"></Icon>} type="primary">播放全部</Button>
        <Button onClick={() => { openAddPlaylistSongDialog({ songs, userPlaylist, addOrRemoveSong }) }} icon={<Icon name="icon-add"></Icon>}>添加到歌单</Button>
      </div>
      <MusicList start={musiclistStart} list={songs} getMenu={getMenu} ></MusicList>
    </div>
  )
}

export default Daily