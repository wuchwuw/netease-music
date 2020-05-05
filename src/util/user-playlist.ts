import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import api from 'API/index'
import { SET_USER_PLAYLIST } from 'STORE/user/types'
import { createBasePlaylist, PlaylistBaseClass } from './playlist'
import { useDispatch } from 'react-redux'

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
        setUserPlaylist(createBasePlaylist(playlist))
      }
    } catch (e) {}
  }

  function setUserPlaylist (playlist: PlaylistBaseClass[]) {
    dispatch({ type: SET_USER_PLAYLIST, playlist: playlist})
  }

  async function deletePlaylist (deletePlaylist: PlaylistBaseClass, callback?: () => void) {
    try {
      await api.deletePlaylist({ id: deletePlaylist.id })
      setUserPlaylist(playlist.filter(item => item !== deletePlaylist))
      callback && callback()
    } catch (e) {}
  }

  async function subscribePlaylist (playlist: PlaylistBaseClass, isLeftBar: boolean, callback?: () => void) {

  }

  function createPlaylist () {}

  return {
    userPlaylist,
    subPlaylist,
    getUserPlaylist,
    deletePlaylist
  }
}