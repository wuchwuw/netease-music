import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './add-playlist.less'
import { UseDialogProps } from '..'
import Song from 'UTIL/song'
import { PlaylistClass } from 'UTIL/playlist'

export interface AddPlaylistDialogProps {
  songs: Song[]
  userPlaylist: PlaylistClass[]
  addOrRemoveSong: Function
}

const AddPlaylistDialog: React.SFC<UseDialogProps & AddPlaylistDialogProps> = (props) => {

  function addPlaylistSong (playlist: PlaylistClass) {
    try {
      props.addOrRemoveSong(playlist.id, props.songs, 'add', () => {
        props.close()
      })
    } catch (e) {}
  }

  return (
    <Dialog width={470} {...props}>
      <div styleName="add-playlist-dialog-wrap">
        <div className="dialog-title">收藏到歌单</div>
        {/* <div styleName="add-playlist-item">
          <div styleName="add-playlist-cover"><i className="iconfont icon-add active"></i></div>
          <div styleName="add-playlist-info">
            <div styleName="add-playlist-name">创建为新歌单</div>
          </div>
        </div> */}
        <div styleName="add-playlist-item-wrap">
          {
            props.userPlaylist.map(playlist => (
              <div onClick={() => { addPlaylistSong(playlist) }} key={playlist.id} styleName="add-playlist-item playlist">
                <div styleName="add-playlist-cover"><img src={playlist.coverImgUrl} alt=""/></div>
                <div styleName="add-playlist-info">
                  <div>{playlist.name}</div>
                  <div styleName="add-playlist-info-trackcount">{playlist.trackCount}首音乐</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Dialog>
  )
}

export default AddPlaylistDialog