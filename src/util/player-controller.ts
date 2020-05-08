import { useSelector, useDispatch } from "react-redux"
import { RootState } from "STORE/index"
import Song from "./song"
import api from "API/index"
import { SET_PLAY_STATUS, SET_CURRENT_SONG, SET_PLAYLIST } from 'STORE/player/types'
import { PlyerMode } from 'STORE/player/types'

// page-id or page
export interface Source {
  id: string
  name: string
}

export interface SongWidthSource {
  song: Song
  source: Source
}

function getShufflePlaylist (current: SongWidthSource[]) {
  let shuffle = current.slice()
  for (let i = 1; i < shuffle.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffle[i], shuffle[random]] = [shuffle[random], shuffle[i]];
  }
  return shuffle
}

function getSongWidthSource (song: Song, source: Source): SongWidthSource {
  return { song, source }
}
function getSonglistWidthSource (song: Song[], source: Source): SongWidthSource[] {
  return song.map(item => {
    return { song: item, source }
  })
}

function isSameSongInMusiclist (song1: SongWidthSource, song2: SongWidthSource) {
  return song1.song.id === song2.song.id && song1.source.id === song2.source.id
}

function getSongIndexInMusiclist (musiclist: SongWidthSource[], song: SongWidthSource): number {
  return musiclist.findIndex(item => isSameSongInMusiclist(song, item))
}

let randomPlaylist: SongWidthSource[] = []
let cacheMusiclist: SongWidthSource[] = []
let cacheCurrentSong: SongWidthSource = { song: new Song({}), source: { id: '', name: ''}}
let sourceIds: string[] = []

export function usePlayerController () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const currentMusiclist = useSelector((state: RootState) => state.player.playlist)
  const playing = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.player.mode)

  function getNext (type: 'next' | 'prev') {
    let songs = mode === PlyerMode.RANDOM ? randomPlaylist : cacheMusiclist
    if (songs.length === 0) return
    if (currentSong && mode === PlyerMode.LOOPONE) return currentSong
    let currentIndex = getSongIndexInMusiclist(songs, currentSong)
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
    nextSong && playSong(nextSong)
  }

  function prev () {
    const nextSong = getNext('prev')
    nextSong && playSong(nextSong)
  }

  function togglePlay () {
    if (playing) {
      pause()
    } else {
      play()
    }
  }

  async function playSong (currentSong: SongWidthSource) {
    try {
      let audio = getAudio()
      audio.currentTime = 0
      let res = await api.getSongUrl({ id: currentSong.song.id })
      audio.src = res.data.data[0].url
      setCurrentSongWidthSource(currentSong)
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

  function setCurrentMusiclistWidthSource (songs: SongWidthSource[]) {
    dispatch({ type: SET_PLAYLIST, playlist: songs })
    cacheMusiclist = songs
  }

  function setCurrentSongWidthSource (song: SongWidthSource) {
    dispatch({ type: SET_CURRENT_SONG, currentSong: song })
    cacheCurrentSong = song
  }

  function getAudio () {
    const audio = document.querySelector('#player-audio') as HTMLAudioElement
    return audio
  }

  function nextPlaySong (source: Source, song: Song) {
    const songWidthSource = getSongWidthSource(song, source)
    if (isSameSongInMusiclist(currentSong, songWidthSource)) return
    let currentSongIndex = getSongIndexInMusiclist(currentMusiclist, currentSong)
    let index = getSongIndexInMusiclist(currentMusiclist, songWidthSource)
    if (index === -1) {
      if (currentMusiclist.length === 0) {
        playSong(songWidthSource)
      }
      currentMusiclist.splice(++currentSongIndex, 0, songWidthSource)
    } else {
      currentMusiclist.splice(index, 1)
      currentMusiclist.splice(index < currentSongIndex ? currentSongIndex : ++currentSongIndex, 0, songWidthSource)
    }
    setCurrentMusiclistWidthSource(currentMusiclist)
  }

  function nextPlayPlaylist (source: Source, musiclist: Song[]) {
    if (sourceIds.indexOf(source.id) > -1) return
    if (currentMusiclist.length === 0) {
      start(source, musiclist[0], musiclist)
    } else {
      let currentSongIndex = getSongIndexInMusiclist(currentMusiclist, currentSong)
      let musiclistWidthSource = getSonglistWidthSource(musiclist, source)
      currentMusiclist.splice(++currentSongIndex, 0, ...musiclistWidthSource)
      setCurrentMusiclistWidthSource(currentMusiclist)
      sourceIds.push(source.id)
    }
  }

  function start (source: Source, song: Song, musiclist?: Song[]) {
    // TODO check song
    const songWidthSource = getSongWidthSource(song, source)
    playSong(songWidthSource)
    if (musiclist) {
      // 替换列表
      let musiclistWidthSource = getSonglistWidthSource(musiclist, source)
      setCurrentMusiclistWidthSource(musiclistWidthSource)
      randomPlaylist = getShufflePlaylist(musiclistWidthSource)
      sourceIds = [source.id]
    } else {
      if (getSongIndexInMusiclist(currentMusiclist, songWidthSource) === -1) {
        let insertIndex = getSongIndexInMusiclist(currentMusiclist, currentSong)
        currentMusiclist.splice(++insertIndex, 0, songWidthSource)
        setCurrentMusiclistWidthSource(currentMusiclist)
      }
    }
  }

  return {
    start,
    next,
    prev,
    togglePlay,
    currentSong: currentSong,
    currentMusiclist,
    playing,
    nextPlayPlaylist,
    nextPlaySong
  }
}
