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