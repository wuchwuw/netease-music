import {
  PlayerState,
  PlayerActionTypes,
  SET_CURRENT_SONG,
  SET_PLAYLIST,
  SET_PLAY_STATUS,
  PLAY_NEXT,
  PLAY_PREV,
  PLAYER_FULL_SCREEN
} from './types'
import Song, { play } from 'UTIL/song'

const initialState: PlayerState = {
  currentSong: new Song({}),
  playlist: [],
  playing: false,
  fullScreen: false
}

export function playerReducer (state = initialState, action: PlayerActionTypes): PlayerState {
  switch (action.type) {
    case SET_CURRENT_SONG:
      state.currentSong = action.currentSong
      return state
    case SET_PLAYLIST:
      state.playlist = action.playlist
      return state
    case SET_PLAY_STATUS:
      state.playing = action.playing
      return state
    case PLAYER_FULL_SCREEN:
      state.fullScreen = action.fullScreen
      return state
    default:
      return state
  }
}