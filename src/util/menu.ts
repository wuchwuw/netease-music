import { PlaylistClass } from 'UTIL/playlist'
import { usePlayerController, Source } from 'UTIL/player-controller'
import { createComfirmDialog } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from './user-playlist'
import Song from './song'
import { Album } from './album'

export interface MenuType {
  name: string
  trigger?: Function
  sub?: MenuType[]
}

export function usePlaylistContextMenu () {
  const { start, nextPlayPlaylist } = usePlayerController()
  const confirm = createComfirmDialog()
  const { deletePlaylist, subscribePlaylist, getUserPlaylistDetail } = useUserPlaylist()

  function play (playlist: PlaylistClass, next: boolean) {
    getUserPlaylistDetail(playlist.id, (p) => {
      if (p.tracks.length !== 0) {
        next ?
        nextPlayPlaylist({id: `playlist-${playlist.id}`, name: playlist.name}, p.tracks)
        :
        start({id: `playlist-${playlist.id}`, name: playlist.name}, p.tracks[0], p.tracks)
      }
    })
  }

  function getPlaylistMenu (playlist: PlaylistClass) {

    function deletePlaylistConfirm (playlist: PlaylistClass) {
      confirm({
        text: '确定删除该歌单?',
        buttonText: '确定',
        confirm: !playlist.subscribed ? (callback?: () => void) => {
          deletePlaylist(playlist, callback)
        } : (callback?: () => void) => {
          subscribePlaylist(playlist, callback)
        }
      })
    }

    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => { play(playlist, false) } },
      { name: '下一首播放', trigger: () => { play(playlist, true) } }
    ]

    const deleteMenu: MenuType = { name: '删除歌单', trigger: () => { deletePlaylistConfirm(playlist) } }

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
  const { start, nextPlaySong } = usePlayerController()
  const { addOrRemoveSong, removeSongWidthComfirm, userPlaylist, isUserPlaylist } = useUserPlaylist()

  function getSongMenu (source: Source, song: Song, playlist?: PlaylistClass, callback?: () => void) {

    function getCollectSubType (playlist?: PlaylistClass) {
      return userPlaylist.map((item) => {
        return { name: item.name, data: item, trigger: () => { addOrRemoveSong(item.id, [song], 'add') }}
      })
    }
    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => { start(source, song, playlist && playlist.tracks) } },
      { name: '下一首播放', trigger: () => { nextPlaySong(source, song) } },
      { name: '查看评论', trigger: () => {} },
      { name: '收藏', sub: getCollectSubType(playlist) }
    ]
    const deleteMenu: MenuType = { name: '从歌单中删除', trigger: () => { removeSongWidthComfirm(playlist!.id, song, callback) } }
    if (playlist && isUserPlaylist(playlist.id)) {
      return [...defaultMenu, deleteMenu]
    } else {
      return [...defaultMenu]
    }
  }

  return {
    getSongMenu
  }
}

export function useAlbumContextMenu () {
  const { start, nextPlaySong } = usePlayerController()
  const { addOrRemoveSong, userPlaylist } = useUserPlaylist()

  function getAlubmMenu (source: Source, song: Song, album: Album) {
    function getCollectSubType () {
      return userPlaylist.map((item) => {
        return { name: item.name, data: item, trigger: () => { addOrRemoveSong(item.id, [song], 'add') }}
      })
    }
    const defaultMenu: MenuType[] = [
      { name: '播放', trigger: () => { start(source, song, album.songs) } },
      { name: '下一首播放', trigger: () => { nextPlaySong(source, song) } },
      { name: '查看评论', trigger: () => {} },
      { name: '收藏', sub: getCollectSubType() }
    ]

    return defaultMenu
  }

  return {
    getAlubmMenu
  }
}