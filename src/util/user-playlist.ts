import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import api from 'API/index'
import { SET_USER_PLAYLIST } from 'STORE/user/types'
import { createPlaylistList, PlaylistClass } from './playlist'
import { useDispatch } from 'react-redux'
import { SET_UPDATE_FAVORITE_PLAYLIST } from 'STORE/commen/types'

export function useUserPlaylist () {
  const playlist = useSelector((state: RootState) => state.user.playlist)
  const user = useSelector((state: RootState) => state.user.user)
  const userPlaylist = playlist.filter(item => item.creator.userId === user.userId)
  const subPlaylist = playlist.filter(item => item.creator.userId !== user.userId)
  const dispatch = useDispatch()

  async function getUserPlaylist (userId?: number) {
    try {
      const { data: { playlist } } = await api.getUserPlaylist({ uid: userId || user.userId })
      if (playlist.length) {
        playlist[0].name = '我喜欢的音乐'
        setUserPlaylist(createPlaylistList(playlist))
      }
    } catch (e) {}
  }

  function setUserPlaylist (playlist: PlaylistClass[]) {
    dispatch({ type: SET_USER_PLAYLIST, playlist: playlist})
  }

  async function deletePlaylist (deletePlaylist: PlaylistClass, callback?: () => void) {
    try {
      await api.deletePlaylist({ id: deletePlaylist.id })
      setUserPlaylist(playlist.filter(item => item !== deletePlaylist))
      callback && callback()
    } catch (e) {}
  }

  async function subscribePlaylist (subPlaylist: PlaylistClass, callback?: (p: PlaylistClass) => void) {
    try {
      const t = subPlaylist.subscribed ? 2 : 1
      const subscribedCount = subPlaylist.subscribed ? -- subPlaylist.subscribedCount : ++ subPlaylist.subscribedCount
      await api.playlistSubscribers({ t, id: subPlaylist.id })
      setUserPlaylist(subPlaylist.subscribed ? playlist.filter(item => item.id !== subPlaylist.id) : playlist.concat([subPlaylist]))
      subPlaylist.subscribedCount = subscribedCount
      subPlaylist.subscribed = !subPlaylist.subscribed
      callback && callback(subPlaylist)
    } catch (e) {}
  }

  function createPlaylist () {}

  async function addOrRemoveSong (playlistId: number, songId: number, type: 'add' | 'del', cb?: Function) {
    try {
      const res = await api.addOrRemoveSong({ op: type, pid: playlistId, tracks: songId })
      cb && cb()
    } catch (e) {}
  }

  async function getUserPlaylistDetail (playlistId: number, cb?: (p: PlaylistClass) => void) {
    try {
      const res = await api.getPlaylist({ id: playlistId })
      cb && cb(new PlaylistClass(res.data.playlist))
    } catch (e) {}
  }

  function shouldUpdateUserFavoritePlaylist (playlistId: number) {
    if (!playlist[0] || !playlistId) return
    if (playlist[0].id === playlistId) {
      dispatch({ type: SET_UPDATE_FAVORITE_PLAYLIST})
    }
  }

  return {
    userPlaylist,
    subPlaylist,
    getUserPlaylist,
    deletePlaylist,
    subscribePlaylist,
    addOrRemoveSong,
    getUserPlaylistDetail,
    shouldUpdateUserFavoritePlaylist,
    isUserPlaylist: (playlistId: number) => !!(userPlaylist.findIndex(item => Number(playlistId) === item.id) > -1),
    isMyFavotitePlaylist: (playlistId: number) => !!(userPlaylist[0] && userPlaylist[0].id && userPlaylist[0].id === playlistId)
  }
}