import React from 'react'
import './left-bar.less'
import { NavLink } from 'react-router-dom'
import { useDialog, LoginDialog } from 'COMPONENTS/dialog/index'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import { useContainer } from 'COMPONENTS/container/container'
import CreatePlaylistDialog from 'COMPONENTS/dialog/create-playlist/create-playlist-dialog'
import { usePlaylistContextMenu } from 'UTIL/menu'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { ContextMenuWrap, ConnectedMenu } from 'COMPONENTS/context-menu/context-menu'
import { usePageForword } from 'ROUTER/hooks'
import { logout } from 'UTIL/account'
import { openLoginDialog } from 'COMPONENTS/dialog/login/login-dialog'
import { setPlaylistCacheOnce } from 'UTIL/playlist-cache'

const MENU_NAME = 'left-bar-contextmenu'
const Menu = ConnectedMenu(MENU_NAME)

const LeftBar: React.SFC = () => {
  const createDialogProps = useDialog()
  const user = useSelector((state: RootState) => state.user.user)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const { visiable, open } = useContainer(['.leftbar-user-panel'])
  const { getPlaylistMenu } = usePlaylistContextMenu()
  const { userPlaylist, subPlaylist, isMyFavotitePlaylist } = useUserPlaylist()
  const { goUserDetail } = usePageForword()

  return (
    <div className='leftbar-wrap'>
      {
        isLogin ?
        <div className="leftbar-user">
          <div onClick={ () => { goUserDetail(user.userId) }} className="leftbar-login">
            <img className="leftbar-login-avatar" src={user.avatarUrl+'?param=100y100'} alt=""/>
          </div>
          <div onClick={ () => { open() }} className="leftbar-login-username">
            {user.nickname}
            <i className="iconfont icon-triangle-full"></i>
            {
              visiable &&
              <div className="leftbar-user-panel">
                <div className="leftbar-user-social">
                  <div className="leftbar-user-social-item">
                    <div>{user.eventCount}</div>
                    <div>动态</div>
                  </div>
                  <div className="leftbar-user-social-item">
                    <div>{user.follows}</div>
                    <div>关注</div>
                  </div>
                  <div className="leftbar-user-social-item">
                    <div>{user.followeds}</div>
                    <div>粉丝</div>
                  </div>
                </div>
                <div className="leftbar-user-panel-item">
                  <div><i className="iconfont icon-vip"></i>会员中心</div>
                  <div><i className="iconfont icon-level"></i>等级</div>
                  <div><i className="iconfont icon-mail"></i>商城</div>
                  <div><i className="iconfont icon-setting"></i>个人信息设置</div>
                  <div><i className="iconfont icon-phone"></i>绑定社交账号</div>
                  <div onClick={() => { logout() }}><i className="iconfont icon-logout"></i>退出登录</div>
                </div>
              </div>
            }
          </div>
        </div>
        :
        <div className="leftbar-user">
          <div className="leftbar-login" onClick={() => openLoginDialog()}><i className="iconfont icon-userlogin"></i></div>未登录<span className="leftbar-triangle"></span>
        </div>
      }
      <div className="leftbar-playlist">
        <NavLink to={'/home'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-neteastmusic"></i>发现音乐
        </NavLink>
        <NavLink to={'/fm'} activeClassName="active" className="leftbar-item">
          <i className="iconfont iconxinhao"></i>私人FM
        </NavLink>
        <NavLink to={'/video'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-mv"></i>视频
        </NavLink>
        <NavLink to={'/activity'} activeClassName="active" className="leftbar-item">
          <i className="iconfont iconfriend"></i>朋友
        </NavLink>
        <div className="leftbar-item-title">我的音乐</div>
        <NavLink to={'/cloud'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-cloud"></i>我的音乐云盘
        </NavLink>
        <NavLink to={'/star'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-star"></i>我的收藏
        </NavLink>
        <div className="leftbar-item-title">创建的歌单<i onClick={() => createDialogProps.toggle()} className="iconfont icon-add"></i></div>
        {
          userPlaylist.map(item => (
            <ContextMenuWrap key={item.id} id={MENU_NAME} menu={getPlaylistMenu(item)}>
              <NavLink onClick={() => { setPlaylistCacheOnce(item) }} key={item.id} to={`/playlist/${item.id}`} activeClassName="active" className="leftbar-item">
                <i className={`iconfont ${isMyFavotitePlaylist(item.id) ? 'iconxin' : 'icon-playlist'}`}></i><div>{item.name}</div>
              </NavLink>
            </ContextMenuWrap>
          ))
        }
        { !!subPlaylist.length && <div className="leftbar-item-title">收藏的歌单</div> }
        {
          subPlaylist.map(item => (
            <ContextMenuWrap key={item.id} id={MENU_NAME} menu={getPlaylistMenu(item)}>
              <NavLink onClick={() => { setPlaylistCacheOnce(item) }} key={item.id} to={`/playlist/${item.id}`} activeClassName="active" className="leftbar-item">
                <i className="iconfont icon-playlist"></i><div>{item.name}</div>
              </NavLink>
            </ContextMenuWrap>
          ))
        }
      </div>
      <LoginDialog></LoginDialog>
      <CreatePlaylistDialog {...createDialogProps}></CreatePlaylistDialog>
      <Menu></Menu>
    </div>
  )
}

export default LeftBar