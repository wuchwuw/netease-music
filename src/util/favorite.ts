import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'STORE/index'
import { SET_FAVORITE_IDS } from 'STORE/commen/types'
import api from 'API/index'
import notificationApi from 'COMPONENTS/notification/index'

export function useFavorite () {
  const favoriteIds = useSelector((state: RootState) => state.commen.favoriteIds)
  const dispatch = useDispatch()

  function isFavorite (id: number) {
    if (!id) return false
    return favoriteIds.indexOf(id) > -1
  }

  function setFavoriteIds (favoriteIds: number[]) {
    dispatch({ type: SET_FAVORITE_IDS, favoriteIds: favoriteIds })
  }

  function updateFavoriteIds (ids: number[]) {
    let fIds = favoriteIds.slice()

    ids.forEach((id) => {
      const index = favoriteIds.indexOf(id)
      if (index > -1) {
        fIds.splice(index, 1)
      } else {
        fIds.unshift(id)
      }
    })
    setFavoriteIds(fIds)
  }

  async function getFavoriteIds (uid: number) {
    try {
      const res = await api.getUserLikelist({ uid })
      setFavoriteIds(res.data.ids)
    } catch (e) {}
  }

  async function favorite (id: number, cb?: any) {
    try {
      const like = !isFavorite(id)
      await api.like({ id, like })
      updateFavoriteIds([id])
      notificationApi.success({
        content: like? '已添加到我喜欢的音乐' : '取消喜欢成功'
      })
      cb && cb()
    } catch (e) {}
  }

  return {
    favoriteIds,
    getFavoriteIds,
    isFavorite,
    updateFavoriteIds,
    setFavoriteIds,
    favorite
  }
}
