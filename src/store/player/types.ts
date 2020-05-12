import { SongWidthSource } from "UTIL/player-controller"

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_PLAYLIST = 'SET_PLAYLIST'
export const SET_PLAY_STATUS = 'SET_PLAY_STATUS'
export const PLAY_NEXT = 'PLAY_NEXT'
export const PLAY_PREV = 'PLAY_PREV'
export const PLAYER_FULL_SCREEN = 'PLAYER_FULL_SCREEN'
export const SET_MODE = 'SET_MODE'
export const SET_PLAY_HISTORY = 'SET_PLAY_HISTORY'
export const SET_FM_SCREEN_MUSIC = 'SET_FM_SCREEN_MUSIC'

export enum PlyerMode {
  LOOP,
  LOOPONE,
  RANDOM,
  ORDER
}

interface SetMode {
  type: typeof SET_MODE
  mode: PlyerMode
}

interface SetCurrentSongAction {
  type: typeof SET_CURRENT_SONG
  currentSong: SongWidthSource
}

interface SetPlaylistAction {
  type: typeof SET_PLAYLIST
  playlist: SongWidthSource[]
}

interface SetPlayStatusAction {
  type: typeof SET_PLAY_STATUS
  playing: boolean
}

interface PLAYER_FULL_SCREEN {
  type: typeof PLAYER_FULL_SCREEN,
  fullScreen: boolean
}

interface setPlayHistory {
  type: typeof SET_PLAY_HISTORY,
  playHistory: SongWidthSource[]
}

export type FM = { song: SongWidthSource, type:  FMType }
export type FMType = 'current' | 'next' | 'prev' | 'remove' | 'delete'

interface setFMScreenMusicList {
  type: typeof SET_FM_SCREEN_MUSIC,
  fmScreenMusicList: FM[]
}

export interface PlayerState {
  currentSong: SongWidthSource
  playing: boolean,
  playlist: SongWidthSource[],
  playHistory: SongWidthSource[],
  fullScreen: boolean,
  mode: PlyerMode,
  fmScreenMusicList: FM[]
}

export type PlayerActionTypes =
  SetCurrentSongAction |
  SetPlaylistAction |
  SetPlayStatusAction |
  PLAYER_FULL_SCREEN |
  SetMode |
  setPlayHistory |
  setFMScreenMusicList
