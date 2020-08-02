import {
  PlayerState,
  PlayerActionTypes,
  SET_CURRENT_SONG,
  SET_PLAYLIST,
  SET_PLAY_STATUS,
  PLAYER_FULL_SCREEN,
  SET_MODE,
  PlyerMode,
  SET_PLAY_HISTORY,
  SET_FM_SCREEN_MUSIC,
  FMType,
  FM,
  SET_PLAYERSTATUS,
  SET_CURRENTTIME_CHANGE
} from './types'
import Song from 'UTIL/song'

let FM_TYPE: FMType[] = ['current', 'next', 'prev', 'remove', 'delete']

const initialState: PlayerState = {
  currentSong: { song: new Song({}), source: { id: '', name: ''} },
  playlist: [],
  playHistory: [],
  playing: false,
  fullScreen: false,
  mode: PlyerMode.LOOP,
  fmScreenMusicList: FM_TYPE.map(item => { return { song: new Song({}), type: item } }),
  playerStatus: 'default',
  onCurrentTimeChange: false
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
    case SET_MODE:
      state.mode = action.mode
      return state
    case SET_PLAY_HISTORY:
      state.playHistory = action.playHistory.slice()
      return state
    case SET_FM_SCREEN_MUSIC:
      state.fmScreenMusicList = [...action.fmScreenMusicList]
      return state
    case SET_PLAYERSTATUS:
      state.playerStatus = action.playerStatus
      return state
    case SET_CURRENTTIME_CHANGE:
      state.onCurrentTimeChange = action.onCurrentTimeChange
      return state
    default:
      return state
  }
}