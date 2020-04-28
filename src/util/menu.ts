import {PlaylistClass} from 'UTIL/playlist'
import { usePlayerController } from 'UTIL/player-controller'

export interface MenuType {
  name: string
  trigger: Function
}

export function usePlaylistContextMenu () {
  const { start } = usePlayerController()

  function play (playlist: PlaylistClass) {
    // todo  get detail and cache
  }

  function getPlaylistMenu (playlist: PlaylistClass) {

    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => {} },
      { name: '下一首播放', trigger: () => {} }
    ]

    const deleteMenu: MenuType = { name: '删除歌单', trigger: () => {} }

    const editMenu: MenuType = { name: '编辑歌单信息', trigger: () => {} }

    if (playlist && playlist.name === '我喜欢的音乐') {
      return [...defaultMenu]
    } else if (!playlist.subscribed) {
      return [...defaultMenu, deleteMenu, editMenu]
    } else {
      return [...defaultMenu, deleteMenu]
    }
  }

  return {
    getPlaylistMenu
  }
}


export function useSongContextMenu () {
  const { start } = usePlayerController()

  const defaultMenu: MenuType[] = [
    { name: '播放', trigger: () => {} },
    { name: '下一首播放', trigger: () => {} }
  ]

  function getSongMenu () {

  }

  return {
    getSongMenu
  }
}