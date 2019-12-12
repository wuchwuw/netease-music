import Song from "UTIL/song"

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_PLAYLIST = 'SET_PLAYLIST'
export const SET_PLAY_STATUS = 'SET_PLAY_STATUS'
export const PLAY_NEXT = 'PLAY_NEXT'
export const PLAY_PREV = 'PLAY_PREV'
export const PLAYER_FULL_SCREEN = 'PLAYER_FULL_SCREEN'

interface SetCurrentSongAction {
  type: typeof SET_CURRENT_SONG
  currentSong: Song
}

interface SetPlaylistAction {
  type: typeof SET_PLAYLIST
  playlist: Song[]
}

interface SetPlayStatusAction {
  type: typeof SET_PLAY_STATUS
  playing: boolean
}

interface PLAY_NEXT {
  type: typeof PLAY_NEXT
}

interface PLAY_PREV {
  type: typeof PLAY_PREV
}

interface PLAYER_FULL_SCREEN {
  type: typeof PLAYER_FULL_SCREEN,
  fullScreen: boolean
}

export interface PlayerState {
  currentSong: Song
  playing: boolean,
  playlist: Song[],
  fullScreen: boolean
}

export type PlayerActionTypes = 
  SetCurrentSongAction | 
  SetPlaylistAction | 
  SetPlayStatusAction | 
  PLAY_NEXT | 
  PLAY_PREV |
  PLAYER_FULL_SCREEN