import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import api from 'API/index'
import { SET_USER_PLAYLIST } from 'STORE/user/types'
import { createPlaylistList, PlaylistClass } from './playlist'
import { useDispatch } from 'react-redux'
import { SET_UPDATE_FAVORITE_PLAYLIST } from 'STORE/commen/types'
import { useCreateDialog, COMFIRM_DIALOG } from 'COMPONENTS/dialog/create'
import { useFavorite } from './favorite'
import notificationApi from 'COMPONENTS/notification'
import Song from './song'
import { getPlaylistTracksCache, setPlaylistTracksCache } from './playlist-cache'

export function useUserPlaylist () {
  const playlist = useSelector((state: RootState) => state.user.playlist)
  const user = useSelector((state: RootState) => state.user.user)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const userPlaylist = playlist.filter(item => item.creator.userId === user.userId)
  const subPlaylist = playlist.filter(item => item.creator.userId !== user.userId)
  const dispatch = useDispatch()
  const confirm = useCreateDialog(COMFIRM_DIALOG)
  const { updateFavoriteIds } = useFavorite()

  async function getUserPlaylist (userId?: number) {
    console.log(isLogin)
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

  function subscribePlaylist (subPlaylist: PlaylistClass, callback?: (p: PlaylistClass) => void) {
    async function sub (cb?: () => void) {
      try {
        const t = subPlaylist.subscribed ? 2 : 1
        const subscribedCount = subPlaylist.subscribed ? -- subPlaylist.subscribedCount : ++ subPlaylist.subscribedCount
        await api.playlistSubscribers({ t, id: subPlaylist.id })
        setUserPlaylist(subPlaylist.subscribed ? playlist.filter(item => item.id !== subPlaylist.id) : [subPlaylist].concat(playlist))
        subPlaylist.subscribedCount = subscribedCount
        subPlaylist.subscribed = !subPlaylist.subscribed
        callback && callback(subPlaylist)
        cb && cb()
      } catch (e) {}
    }
    if (subPlaylist.subscribed) {
      confirm.open({
        text: '确定不再收藏该歌单?',
        buttonText: '确定',
        confirm: (confirmCallback) => {
          sub(() => {
            confirmCallback && confirmCallback()
            notificationApi.success({
              content: '取消收藏歌单成功!'
            })
          })
        }
      })
    } else {
      sub(() => {
        notificationApi.success({
          content: '收藏歌单成功!'
        })
      })
    }
  }

  function createPlaylist () {}

  function removeSongWidthComfirm (playlistId: number, song: Song, callback?: () => void) {
    confirm.open({
      text: '确定将选中的歌曲从该歌单中删除?',
      buttonText: '确定',
      confirm: (confirmCallback) => {
        addOrRemoveSong(playlistId, [song], 'del', () => {
          confirmCallback && confirmCallback()
          callback && callback()
        })
      }
    })
  }

  async function addOrRemoveSong (playlistId: number, songs: Song[], type: 'add' | 'del', cb?: Function) {
    try {
      const ids = songs.map(item => item.id)
      const res = await api.addOrRemoveSong({ op: type, pid: playlistId, tracks: ids })
      if (type === 'add') {
        if (res.data.code > 200) {
          notificationApi.error({ content: res.data.message })
        } else {
          notificationApi.success({ content: '已添加到歌单' })
        }
      }
      // 如果是最喜欢的歌单，则更新favoriteIds
      if (isMyFavotitePlaylist(playlistId)) {
        updateFavoriteIds(ids)
      }
      updatePlaylistTracks(playlistId, songs, type)
      cb && cb()
    } catch (e) {}
  }

  function updatePlaylistTracks (playlistId: number, songs: Song[], type: 'add' | 'del') {
    let tracks = getPlaylistTracksCache(playlistId).slice()
    if (!tracks.length) return
    if (type === 'add') {
      tracks = songs.concat(tracks)
    } else if (type === 'del') {
      songs.forEach(song => {
        const index = tracks.findIndex(track => track.id === song.id)
        if (index > -1) {
          tracks.splice(index, 1)
        }
      })
    }
    setPlaylistTracksCache(playlistId, tracks)
    dispatch({ type: SET_UPDATE_FAVORITE_PLAYLIST })
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
      dispatch({ type: SET_UPDATE_FAVORITE_PLAYLIST })
    }
  }

  const isMyFavotitePlaylist = (playlistId: number) => !!(userPlaylist[0] && userPlaylist[0].id && userPlaylist[0].id === playlistId)

  const isUserPlaylist = (playlistId: number) => !!(userPlaylist.findIndex(item => Number(playlistId) === item.id) > -1)

  return {
    userPlaylist,
    subPlaylist,
    getUserPlaylist,
    deletePlaylist,
    subscribePlaylist,
    addOrRemoveSong,
    getUserPlaylistDetail,
    shouldUpdateUserFavoritePlaylist,
    isUserPlaylist,
    isMyFavotitePlaylist,
    removeSongWidthComfirm
  }
}