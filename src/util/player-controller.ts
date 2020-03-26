import { useSelector, useDispatch } from "react-redux"
import { RootState } from "STORE/index"
import Song from "./song"
import api from "API/index"
import { SET_PLAY_STATUS, SET_CURRENT_SONG, SET_PLAYLIST } from 'STORE/player/types'

export function usePlayerController () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const currentPlaylist = useSelector((state: RootState) => state.player.playlist)
  const playing = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()
  
  function next () {
    if (currentPlaylist.length > 0) {
      let currentIndex = currentPlaylist.indexOf(currentSong)
      if (currentIndex > -1) {
        if (currentIndex === currentPlaylist.length - 1) {
          currentIndex = 0
        } else {
          currentIndex ++
        }
        const nextSong = currentPlaylist[currentIndex]
        start(nextSong)
      }
    }
  }

  function prev () {
    if (currentPlaylist.length > 0) {
      let currentIndex = currentPlaylist.indexOf(currentSong)
      if (currentIndex > -1) {
        if (currentIndex === 0) {
          currentIndex = currentPlaylist.length - 1
        } else {
          currentIndex --
        }
        const prevSong = currentPlaylist[currentIndex]
        start(prevSong)
      }
    }
  }

  function togglePlay () {
    if (playing) {
      pause()
    } else {
      play()
    }
  }

  async function playSong (currentSong: Song) {
    try {
      let audio = getAudio()
      audio.currentTime = 0
      let res = await api.getSongUrl({ id: currentSong.id })
      audio.src = res.data.data[0].url
      play()
    } catch (e) {}
  }

  function play () {
    const audio = getAudio()
    audio && audio.play()
    setPlayStatus(true)
  }

  function pause () {
    const audio = getAudio()
    audio && audio.pause()
    setPlayStatus(false)
  }

  function setPlayStatus (playing: boolean) {
    dispatch({ type: SET_PLAY_STATUS, playing })
  }

  function setCurrentPlaylist (songs: Song[]) {
    dispatch({ type: SET_PLAYLIST, playlist: songs })
  }

  function setCurrentSong (song: Song) {
    dispatch({ type: SET_CURRENT_SONG, currentSong: song })
  }

  function getAudio () {
    const audio = document.querySelector('#player-audio') as HTMLAudioElement
    return audio
  }

  function start (song: Song, playlist?: Song[]) {
    // TODO play next
    setCurrentSong(song)
    playSong(song)
    if (playlist) {
      setCurrentPlaylist(playlist)
    } else {
      // TODO update currentplaylist
    }
  }
  
  return {
    start,
    next,
    prev,
    togglePlay,
    currentSong,
    playing
  }
}
