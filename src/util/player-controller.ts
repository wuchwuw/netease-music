import { useSelector, useDispatch } from "react-redux"
import { RootState } from "STORE/index"
import Song, { createSongList } from "./song"
import api from "API/index"
import { SET_PLAY_STATUS, SET_CURRENT_SONG, SET_PLAYLIST, SET_PLAY_HISTORY, SET_FM_SCREEN_MUSIC, FMType } from 'STORE/player/types'
import { PlyerMode, FM } from 'STORE/player/types'
import notificationApi from "COMPONENTS/notification"
import { useCreateDialog, VIP_DIALOG } from 'COMPONENTS/dialog/create'

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
let FMList: Song[] = []
let canDelete = true

export function usePlayerController () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const currentMusiclist = useSelector((state: RootState) => state.player.playlist)
  const playing = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.player.mode)
  const playHistory = useSelector((state: RootState) => state.player.playHistory)
  const fmScreenMusicList = useSelector((state: RootState) => state.player.fmScreenMusicList)
  const vipDialog = useCreateDialog(VIP_DIALOG)
  // vipDialog.open()

  function canPlay (song: Song): boolean {
    if(song.isVip) {
      vipDialog.open()
      return false
    }
    return true
  }

  function setPlayHistory (song: SongWidthSource) {
    const index = getSongIndexInMusiclist(playHistory, song)
    let history = playHistory.slice()

    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(song)
    dispatch({ type: SET_PLAY_HISTORY, playHistory: history })
  }

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
    const nextSong = currentSong.source.id === 'fm' ? fmNext() : getNext('next')
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
      currentSong.source.id !== 'fm' && setPlayHistory(currentSong)
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
    notificationApi.success({ content: '已添加到播放列表' })
    setCurrentMusiclistWidthSource(currentMusiclist)
  }

  function nextPlayPlaylist (source: Source, musiclist: Song[]) {
    if (sourceIds.indexOf(source.id) > -1) {
      notificationApi.success({ content: '已添加到播放列表' })
      return
    }
    if (currentMusiclist.length === 0) {
      start(source, musiclist[0], musiclist)
    } else {
      let currentSongIndex = getSongIndexInMusiclist(currentMusiclist, currentSong)
      let musiclistWidthSource = getSonglistWidthSource(musiclist, source)
      currentMusiclist.splice(++currentSongIndex, 0, ...musiclistWidthSource)
      setCurrentMusiclistWidthSource(currentMusiclist)
      sourceIds.push(source.id)
      notificationApi.success({ content: '已添加到播放列表' })
    }
  }

  function start (source: Source, song: Song, musiclist?: Song[]) {
    if (!canPlay(song)) {
      return
    }
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

  function getFMByType (type: FMType) {
    return fmScreenMusicList.find(item => item.type === type)!
  }

  function startFM () {
    if (currentSong.source.id === 'fm') {
      togglePlay()
      return
    }
    const song = getSongWidthSource(getFMByType('current').song, { id: 'fm', name: '私人FM'})
    playSong(song)
  }

  function setFMScreenMusicList (fms: FM[]) {
    dispatch({ type: SET_FM_SCREEN_MUSIC, fmScreenMusicList: fms })
  }

  function fmNext () {
    let remove = getFMByType('remove')
    getFMByType('prev').type = 'remove'
    getFMByType('current').type = 'prev'
    getFMByType('next').type = 'current'
    remove.song = FMList.shift()!
    remove.type = 'next'
    if (FMList.length <= 1) {
      getFM()
    }
    setFMScreenMusicList(fmScreenMusicList)
    return getSongWidthSource(getFMByType('current').song, { id: 'fm', name: '私人FM'})
  }

  function fmDelete () {
    let d = getFMByType('delete')
    getFMByType('current').type = 'delete'
    getFMByType('next').type = 'current'
    d.song = FMList.shift()!
    d.type = 'next'
    if (FMList.length <= 1) {
      getFM()
    }
    setFMScreenMusicList(fmScreenMusicList)
  }

  async function getFM (cb?: Function) {
    try {
      const res = await api.getFM()
      FMList.push(...createSongList(res.data.data))
      cb && cb()
    } catch (e) {
      console.log(e)
    }
  }

  function initFM () {
    if (FMList.length) return
    getFM(() => {
      getFMByType('current').song = FMList.shift()!
      getFMByType('next').song = FMList.shift()!
      setFMScreenMusicList(fmScreenMusicList)
    })
  }

  async function addFMTrash (songId: number) {
    if (!canDelete) return
    try {
      canDelete = false
      await api.addFMTrash({ id: songId })
      fmDelete()
      canDelete = true
    } catch (e) {
      canDelete = true
    }
  }

  function getPlayCurrentTime () {
    let audio = getAudio()
    return audio.currentTime
  }

  return {
    start,
    next,
    prev,
    togglePlay,
    currentSong,
    currentMusiclist,
    playing,
    nextPlayPlaylist,
    nextPlaySong,
    playHistory,
    initFM,
    fmScreenMusicList,
    startFM,
    addFMTrash,
    currentFM: fmScreenMusicList.find(item => item.type === 'current')!,
    getPlayCurrentTime
  }
}
