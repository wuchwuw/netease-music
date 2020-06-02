import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './add-playlist.less'
import { UseDialogProps } from '..'
import { useUserPlaylist } from 'UTIL/user-playlist'

const AddPlaylistDialog: React.SFC<UseDialogProps> = (props) => {
  const { userPlaylist } = useUserPlaylist()
  return (
    <Dialog width={470} {...props}>
      <div className="add-playlist-dialog-wrap">
        <div className="dialog-title">收藏到歌单</div>
        <div className="add-playlist-item">
          <div className="add-playlist-cover"><i className="iconfont icon-add active"></i></div>
          <div className="add-playlist-info">
            <div className="add-playlist-name">创建为新歌单</div>
          </div>
        </div>
        <div className="add-playlist-item-wrap">
          {
            userPlaylist.map(playlist => (
              <div key={playlist.id} className="add-playlist-item playlist">
                <div className="add-playlist-cover"><img src={playlist.coverImgUrl} alt=""/></div>
                <div className="add-playlist-info">
                  <div className="add-playlist-info-name">{playlist.name}</div>
                  <div className="add-playlist-info-trackcount">{playlist.trackCount}首音乐</div>
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