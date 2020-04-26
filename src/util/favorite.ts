import { useSelector } from 'react-redux';
import { RootState } from 'STORE/index';

export function useFavorite () {
  const favoriteIds = useSelector((state: RootState) => state.commen.favoriteIds)

  function isFavorite (id: number) {
    return favoriteIds.indexOf(id) > -1
  }

  return {
    favoriteIds,
    isFavorite
  }
}

// export function setFavoriteIds (ids: number[]) {
//   localStorage.setItem('favoriteIds', JSON.stringify(ids))
//   favoriteIds = ids
// }

// export function updateFavoriteIds (id: number) {
//   const index = favoriteIds.indexOf(id)
//   if (index > -1) {
//     favoriteIds.splice(index, 1)
//   } else {
//     favoriteIds.push(id)
//   }
//   localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds))
// }