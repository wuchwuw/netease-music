import { 
  PlayerState, 
  PlayerActionTypes, 
  SET_CURRENT_SONG, 
  SET_PLAYLIST, 
  SET_PLAY_STATUS, 
  PLAY_NEXT, 
  PLAY_PREV
} from './types'
import Song from 'UTIL/song'

const initialState: PlayerState = {
  currentSong: new Song({}),
  playlist: [],
  playing: false
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
        }
      }
      return state
    default:
      return state
  }
}