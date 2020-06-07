import { PlaylistClass } from './playlist'

const PlaylistCache = new Map<number, PlaylistClass>()

export const setPlaylistCache = (playlist: PlaylistClass) => {
  if (!playlist.id) return
  PlaylistCache.set(playlist.id, playlist)
}

export const setPlaylistCacheOnce = (playlist: PlaylistClass) => {
  if (!PlaylistCache.has(playlist.id)) {
    setPlaylistCache(playlist)
  }
}

export const getPlaylistCache = (playlistId: number) => {
  const p = PlaylistCache.get(playlistId)
  return p ? p : new PlaylistClass({})
}

export let playlistDefault = new PlaylistClass({})

export function setPlaylistDefault (p: PlaylistClass) {
  playlistDefault = p
}