import React from 'react'
import PageTitle from 'COMPONENTS/page-title/page-title'
import MusicList from 'COMPONENTS/music-list/music-list'
import { usePlayerController, SongWidthSource } from 'UTIL/player-controller'
import { useSongContextMenu } from 'UTIL/menu'
import Song from 'UTIL/song'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import './history.less'

const History = () => {
  const { playHistory, start } = usePlayerController()
  const songs = playHistory.map((song: SongWidthSource) => song.song)
  const { getSongMenu } = useSongContextMenu()

  function getMenu (song: Song) {
    return getSongMenu({ id: '', name: '' }, song)
  }

  function musiclistStart (song: Song) {
    start({ id: '', name: '' }, song)
  }

  return (
    <div>
      <PageTitle><span className="topbar-content-title">播放历史</span></PageTitle>
      <div styleName="history-option">
        <Button
          icon={<Icon name="icon-play"></Icon>}
          type="primary"
          onClick={() => { start({id: '', name: ''}, songs[0], songs) }}
        >
          播放全部
        </Button>
        <Button
          icon={<Icon name="icon-delete"></Icon>}
        >
          清空
        </Button>
      </div>
      <MusicList noDataText="暂无播放历史" list={songs} getMenu={getMenu} start={musiclistStart}></MusicList>
    </div>
  )
}

export default History