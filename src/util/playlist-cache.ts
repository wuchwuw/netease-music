import { PlaylistClass } from './playlist'
import Song from './song'

const PlaylistCache = new Map<number, PlaylistClass>()
const PlaylistTracksCache = new Map<number, Song[]>()

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

export const setPlaylistTracksCache = (playlist: PlaylistClass, songs: Song[]) => {
  if (!playlist.id) return
  PlaylistTracksCache.set(playlist.id, songs)
}

export const getPlaylistTracksCache = (playlistId: number): Song[] => {
  const songs = PlaylistTracksCache.get(playlistId)
  return songs ? songs : []
}

export let playlistDefault = new PlaylistClass({})