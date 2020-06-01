import React, { useMemo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import Comment from 'COMPONENTS/comment/comment'
import './full-screen-player.less'
import api from 'API/index'
import { createBasePlaylist, PlaylistBaseClass } from 'UTIL/playlist'
import Song, { createSongList } from 'UTIL/song'
import { useFavorite } from 'UTIL/favorite'
import { usePlayerController } from 'UTIL/player-controller'
import Lyric from './lyric'
import { scrollToTop } from 'COMPONENTS/scroll-to-top/scroll-to-top'

interface SimiUser {
  recommendReason: string
  userId: number
  nickname: string
  gender: number
  avatarUrl: string
}

const FullScrrenPlayer: React.SFC = () => {
  const { song: currentSong, source } = useSelector((state: RootState) => state.player.currentSong)
  const { getPlayCurrentTime } = usePlayerController()
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const CommentComponent = useMemo(() => <Comment textareaType="deep" delay={500} showTitle={true} type="music" id={currentSong.id} />, [currentSong.id]);
  const [simiPlaylist, setSimiPlaylist] = useState<PlaylistBaseClass[]>([])
  const [simiSong, setSimiSong] = useState<Song[]>([])
  const [simiUser, setSimiUser] = useState<SimiUser[]>([])
  const { favorite, isFavorite } = useFavorite()

  useEffect(() => {
    getSongSimi()
    if (!currentSong.lyric) {
      currentSong.getLyric(() => {
        currentSong.lyric.play(getPlayCurrentTime())
      })
    } else {
      currentSong.lyric.play(getPlayCurrentTime())
    }
    scrollToTop(['.player'])
  }, [currentSong.id])

  function getSongSimi () {
    function getParams (type: string) {
      return {
        type,
        query: {
          id: currentSong.id
        }
      }
    }
    Promise.all([api.getSimi(getParams('song')), api.getSimi(getParams('playlist')), api.getSimi(getParams('user'))])
      .then(res => {
        setSimiSong(createSongList(res[0].data.songs))
        setSimiPlaylist(createBasePlaylist(res[1].data.playlists))
        setSimiUser(res[2].data.userprofiles)
      })
  }
  return (
    <div className="player">
      <div className="player-wrap">
        <div className="player-cd-wrap">
          <div className="player-cd">
            <img src={currentSong.album.picUrl+'?param=400y400'} alt=""/>
          </div>
          <div className="player-action">
          <i onClick={() => { favorite(currentSong.id) }} className={`iconfont ${isFavorite(currentSong.id) ? 'icon-heart-full active' : 'iconxin'}`}></i>
            <i className="iconfont icon-add"></i>
            <i className="iconfont icon-fmnext"></i>
            <i className="iconfont icon-share"></i>
          </div>
        </div>
        <div className="player-info">
          <div className="player-info-name">{currentSong.name}</div>
          <div className="player-info-album">
            <div className="text-overflow">专辑:<span className="commen-link-blue">{currentSong.album.name}</span></div>
            <div className="text-overflow">歌手:<span className="commen-link-blue">{currentSong.artistName}</span></div>
            <div className="text-overflow">来源:<span className="commen-link-blue">{source.name}</span></div>
          </div>
          <div className="player-info-lyrics">
            <Lyric></Lyric>
          </div>
        </div>
      </div>
      <div className="player-other-info">
        <div className="player-other-comment">
          {CommentComponent}
        </div>
        <div className="player-other-list">
          <div className="player-other-list-playlist">
            <div className="player-other-list-title">包含这首歌的歌单</div>
            {
              simiPlaylist.map(item => (
                <div key={item.id} className="player-other-list-item">
                  <img className="player-other-list-avatar" src={item.coverImgUrl+'?param=100y100'} alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">{item.name}</div>
                    <div className="player-other-list-info-text">{item.playCount_string}</div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="player-other-list-song">
            <div className="player-other-list-title">相似歌曲</div>
            {
              simiSong.map(item => (
                <div key={item.id} className="player-other-list-item">
                  <img className="player-other-list-avatar" src={item.album.picUrl+'?param=100y100'} alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">{item.name}</div>
                    <div className="player-other-list-info-text">{item.artists[0].name}</div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="player-other-list-like">
            <div className="player-other-list-title">喜欢这首歌的人</div>
            {
              simiUser.map(user => (
                <div className="player-other-list-item">
                  <img className="player-other-list-avatar user" src={user.avatarUrl + '?param=100y100'} alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">{user.nickname}</div>
                    <div className="player-other-list-info-text">{user.recommendReason}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullScrrenPlayer