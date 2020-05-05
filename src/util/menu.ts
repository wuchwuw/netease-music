import {PlaylistClass} from 'UTIL/playlist'
import { usePlayerController } from 'UTIL/player-controller'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import { useConfirm } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from './user-playlist'

export interface MenuType {
  name: string
  trigger?: Function
  sub?: MenuType[]
}

export function usePlaylistContextMenu () {
  const { start } = usePlayerController()
  const comfirm = useConfirm()
  const { deletePlaylist } = useUserPlaylist()

  function play (playlist: PlaylistClass) {
    // todo  get detail and cache
  }

  function getPlaylistMenu (playlist: PlaylistClass) {

    function deletePlaylistConfirm () {
      comfirm.open({
        text: '确定删除该歌单?',
        buttonText: '确定',
        confirm: (callback?: () => void) => {
          deletePlaylist(playlist, callback)
        }
      })
    }

    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => {} }
      // { name: '下一首播放', trigger: () => {} }
    ]

    const deleteMenu: MenuType = { name: '删除歌单', trigger: () => { deletePlaylistConfirm() } }

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
  const usePlaylist = useSelector((state: RootState) => state.user.playlist)
  const user = useSelector((state: RootState) => state.user.user)

  function getCollectSubType (playlist?: PlaylistClass) {
    return usePlaylist.filter(item => ((item.creator.userId === user.userId) && playlist && playlist.id !== item.id)).map((item) => {
      return { name: item.name, data: item, trigger: () => {}}
    })
  }

  function getSongMenu (playlist?: PlaylistClass) {
    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => {} },
      { name: '下一首播放', trigger: () => {} },
      { name: '查看评论', trigger: () => {} },
      { name: '收藏', sub: getCollectSubType(playlist) }
    ]
    const deleteMenu: MenuType = { name: '从歌单中删除', trigger: () => {} }
    if (playlist && playlist.creator.userId === user.userId) {
      return [...defaultMenu, deleteMenu]
    } else {
      return [...defaultMenu]
    }
  }

  return {
    getSongMenu
  }
}