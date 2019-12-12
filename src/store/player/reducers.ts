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
      play(state.currentSong)
      return state
    case SET_PLAYLIST:
      state.playlist = action.playlist
      return state
    case SET_PLAY_STATUS:
      state.playing = action.playing
      return state
    case PLAY_NEXT:
      // todo play mode
      if (state.playlist.length > 0) {
        let currentIndex = state.playlist.indexOf(state.currentSong)
        if (currentIndex > -1) {
          if (currentIndex === state.playlist.length - 1) {
            currentIndex = 0
          } else {
            currentIndex ++
          }
          state.currentSong = state.playlist[currentIndex]
          play(state.currentSong)
        }
      }
      return state
    case PLAY_PREV:
      // todo play mode
      if (state.playlist.length > 0) {
        let currentIndex = state.playlist.indexOf(state.currentSong)
        if (currentIndex > -1) {
          if (currentIndex === 0) {
            currentIndex = state.playlist.length - 1
          } else {
            currentIndex --
          }
          state.currentSong = state.playlist[currentIndex]
          play(state.currentSong)
        }
      }
      return state
    case PLAYER_FULL_SCREEN:
      state.fullScreen = action.fullScreen
      return state
    default:
      return state
  }
}