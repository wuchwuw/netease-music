import React, { useMemo, useEffect, useState } from 'react'
import Comment from 'COMPONENTS/comment/comment'
import './full-screen-player.less'
import api from 'API/index'
import { createBasePlaylist, PlaylistBaseClass } from 'UTIL/playlist'
import Song, { createSongList } from 'UTIL/song'
import { useFavorite } from 'UTIL/favorite'
import { usePlayerController } from 'UTIL/player-controller'
import Lyric from './lyric'
import { scrollToTop } from 'COMPONENTS/scroll-to-top/scroll-to-top'
import Icon from 'COMPONENTS/icon/icon'
import { createShareDialog, ShareType, createAddPlaylistSongDialog } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { usePageForword } from 'ROUTER/hooks'
import { genArtists } from 'VIEWS/template/template'

// interface SimiUser {
//   recommendReason: string
//   userId: number
//   nickname: string
//   gender: number
//   avatarUrl: string
// }

const FullScrrenPlayer: React.SFC = () => {
  const [simiPlaylist, setSimiPlaylist] = useState<PlaylistBaseClass[]>([])
  const [simiSong, setSimiSong] = useState<Song[]>([])
  // const [simiUser, setSimiUser] = useState<SimiUser[]>([])
  const { favorite, isFavorite } = useFavorite()
  const openShareDialog = createShareDialog()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const { currentSong: { song, source }, next, start } = usePlayerController()
  const CommentComponent = useMemo(() => <Comment textareaType="deep" delay={500} showTitle={true} type="music" id={song.id} />, [song.id])
  const { goAlbumDetail, goArtistDetail, goPage, goPlaylistDetail } = usePageForword()

  useEffect(() => {
    getSongSimi()
    scrollToTop(['#player'])
  }, [song.id])

  function getSongSimi () {
    function getParams (type: string) {
      return {
        type,
        query: {
          id: song.id
        }
      }
    }
    Promise.all([api.getSimi(getParams('song')), api.getSimi(getParams('playlist'))])
      .then(res => {
        setSimiSong(createSongList(res[0].data.songs))
        setSimiPlaylist(createBasePlaylist(res[1].data.playlists))
      })
  }
  return (
    <div id="player" styleName="player">
      <div styleName="player-wrap">
        <div styleName="player-cd-wrap">
          <div styleName="player-cd">
            <img src={song.album.picUrl+'?param=400y400'} alt=""/>
          </div>
          <div styleName="player-action">
            <Icon
              className={`icon-color-${isFavorite(song.id) ? 'main' : '6'}`}
              onClick={() => { favorite(song.id) }}
              name={`${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}>
            </Icon>
            <Icon name="icon-add" onClick={() => { openAddPlaylistSongDialog({ songs: [song], addOrRemoveSong, userPlaylist }) }}></Icon>
            <Icon name="icon-fmnext" onClick={ next }></Icon>
            <Icon name="icon-share" onClick={() => { openShareDialog({ share: { type: ShareType.SONG, content: song } }) }}></Icon>
          </div>
        </div>
        <div styleName="player-info">
          <div styleName="player-info-name">{song.name}</div>
          <div styleName="player-info-album">
            <div className="text-overflow">专辑:<span onClick={() => { goAlbumDetail(song.album.id) }} className="commen-link-blue">{song.album.name}</span></div>
            <div className="text-overflow">歌手:<span>{genArtists(song.artists, goArtistDetail, 'commen-link-blue')}</span></div>
            <div className="text-overflow">来源:<span onClick={() => { goPage(source.id) }} className="commen-link-blue">{source.name}</span></div>
          </div>
          <div>
            <Lyric song={song}></Lyric>
          </div>
        </div>
      </div>
      <div styleName="player-other-info">
        <div styleName="player-other-comment">
          {CommentComponent}
        </div>
        <div styleName="player-other-list">
          <div styleName="player-other-list-playlist">
            <div styleName="player-other-list-title">包含这首歌的歌单</div>
            {
              simiPlaylist.map(item => (
                <div onClick={() => { goPlaylistDetail(item.id) }} key={item.id} styleName="player-other-list-item">
                  <img styleName="player-other-list-avatar" src={item.coverImgUrl+'?param=100y100'} alt=""/>
                  <div styleName="player-other-list-info">
                    <div styleName="player-other-list-info-name" className="text-overflow">{item.name}</div>
                    <div styleName="player-other-list-info-text"><Icon style={{verticalAlign: '-1px'}} name="icon-triangle"></Icon>{item.playCount_string}</div>
                  </div>
                </div>
              ))
            }
          </div>
          <div styleName="player-other-list-song">
            <div styleName="player-other-list-title">相似歌曲</div>
            {
              simiSong.map(item => (
                <div onClick={() => { start({name: item.album.name, id: `/album/${item.album.id}`}, item) }} key={item.id} styleName="player-other-list-item">
                  <img styleName="player-other-list-avatar" src={item.album.picUrl+'?param=100y100'} alt=""/>
                  <div styleName="player-other-list-info">
                    <div styleName="player-other-list-info-name" className="text-overflow">{item.name}</div>
                    <div styleName="player-other-list-info-text">{item.artistName}</div>
                  </div>
                </div>
              ))
            }
          </div>
          {/* <div styleName="player-other-list-like">
            <div styleName="player-other-list-title">喜欢这首歌的人</div>
            {
              simiUser.map(user => (
                <div styleName="player-other-list-item">
                  <img styleName="player-other-list-avatar user" src={user.avatarUrl + '?param=100y100'} alt=""/>
                  <div styleName="player-other-list-info">
                    <div styleName="player-other-list-info-name" className="text-overflow">{user.nickname}</div>
                    <div styleName="player-other-list-info-text">{user.recommendReason}</div>
                  </div>
                </div>
              ))
            }
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default FullScrrenPlayer