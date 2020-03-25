import { useSelector } from "react-redux"
import { RootState } from "STORE/index"
import Song, { play } from "./song"

export function usePlayer () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const currentPlaylist = useSelector((state: RootState) => state.player.playlist)
  
  function next () {

  }

  function prev () {

  }

  function play (song: Song) {
    const audio = document.querySelector('#player-audio') as HTMLAudioElement
    play(song)
  }
  function pause () {
    const audio = document.querySelector('#player-audio') as HTMLAudioElement
    audio && audio.pause()
  }

  function setCurrentPlaylist (songs: Song[]) {}

  function setCurrentSong (song: Song) {}
  
  return {
    next,
    prev,
    play,
    pause,
    setCurrentPlaylist,
    setCurrentSong
  }
}