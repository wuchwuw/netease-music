import { useSelector, useDispatch } from "react-redux"
import { RootState } from "STORE/index"
import Song from "./song"
import api from "API/index"
import { SET_PLAY_STATUS, SET_CURRENT_SONG, SET_PLAYLIST } from 'STORE/player/types'
import { PlyerMode } from 'STORE/player/types'
import { PlaylistClass } from "./playlist"

function getShufflePlaylist (current: Song[]) {
  let shuffle = current.slice()
  for (let i = 1; i < shuffle.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffle[i], shuffle[random]] = [shuffle[random], shuffle[i]];
  }
  return shuffle
}

let randomPlaylist: Song[] = []
let cacheMusiclist: Song[] = []

export function usePlayerController () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const currentPlaylist = useSelector((state: RootState) => state.player.playlist)
  const playing = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.player.mode)

  function getNext (type: 'next' | 'prev') {
    let songs = mode === PlyerMode.RANDOM ? randomPlaylist : currentPlaylist
    if (songs.length === 0) return
    if (currentSong && mode === PlyerMode.LOOPONE) return currentSong
    let currentIndex = songs.indexOf(currentSong)
    if (currentIndex > -1) {
      type === 'next' ? ++ currentIndex : -- currentIndex
      if (currentIndex === songs.length) {
        currentIndex = 0
      } else if (currentIndex < 0) {
        currentIndex = songs.length - 1
      }
      return songs[currentIndex]
    }
  }

  function next () {
    const nextSong = getNext('next')
    nextSong && start(nextSong)
  }

  function prev () {
    const nextSong = getNext('prev')
    nextSong && start(nextSong)
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
    cacheMusiclist = songs
  }

  function setCurrentSong (song: Song) {
    dispatch({ type: SET_CURRENT_SONG, currentSong: song })
  }

  function getAudio () {
    const audio = document.querySelector('#player-audio') as HTMLAudioElement
    return audio
  }

  function nextPlaySong () {
    // 当前播放和下一首是否相同， 相同的话return
    // 下一首是否在当前列表中，并添加到当前的下一首
    // 列表为空， 直接播放， 调用start即可
  }

  function nextPlayPlaylist () {
    // 逻辑同上
  }

  function start1 (song: Song, playlist?: PlaylistClass) {

  }

  function start (song: Song, musiclist?: Song[]) {
    // TODO check song
    setCurrentSong(song)
    playSong(song)
    if (musiclist) {
      if (musiclist === cacheMusiclist) return
      setCurrentPlaylist(musiclist)
      randomPlaylist = getShufflePlaylist(musiclist)
    } else {
      if (cacheMusiclist.indexOf(song) === -1) {
        if (currentSong.id) {

        }
      }
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
