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
import Icon from 'COMPONENTS/icon/icon'

const MENU_NAME = 'left-bar-contextmenu'
const Menu = ConnectedMenu(MENU_NAME)

const LeftBar: React.SFC = () => {
  const createDialogProps = useDialog()
  const user = useSelector((state: RootState) => state.user.user)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const { visiable, open } = useContainer(['#leftbar-user'])
  const { getPlaylistMenu } = usePlaylistContextMenu()
  const { userPlaylist, subPlaylist, isMyFavotitePlaylist } = useUserPlaylist()
  const { goUserDetail } = usePageForword()

  return (
    <div styleName='leftbar-wrap'>
      {
        isLogin ?
        <div styleName="leftbar-user">
          <div onClick={ () => { goUserDetail(user.userId) }} styleName="leftbar-login">
            <img styleName="leftbar-login-avatar" src={user.avatarUrl+'?param=100y100'} alt=""/>
          </div>
          <div onClick={ () => { open() }} styleName="leftbar-login-username">
            {user.nickname}
            <Icon fontSize={12} name="icon-triangle-full"></Icon>
            {
              visiable &&
              <div id="leftbar-user" styleName="leftbar-user-panel">
                <div styleName="leftbar-user-social">
                  <div styleName="leftbar-user-social-item">
                    <div>{user.eventCount}</div>
                    <div>动态</div>
                  </div>
                  <div styleName="leftbar-user-social-item">
                    <div>{user.follows}</div>
                    <div>关注</div>
                  </div>
                  <div styleName="leftbar-user-social-item">
                    <div>{user.followeds}</div>
                    <div>粉丝</div>
                  </div>
                </div>
                <div styleName="leftbar-user-panel-item">
                  <div><Icon fontSize={18} name="icon-vip"></Icon>会员中心</div>
                  <div><Icon fontSize={19} name="icon-level"></Icon>等级</div>
                  <div><Icon name="icon-mail"></Icon>商城</div>
                  <div><Icon name="icon-setting"></Icon>个人信息设置</div>
                  <div><Icon name="icon-phone"></Icon>绑定社交账号</div>
                  <div onClick={() => { logout() }}><Icon name="icon-logout"></Icon>退出登录</div>
                </div>
              </div>
            }
          </div>
        </div>
        :
        <div styleName="leftbar-user">
          <div styleName="leftbar-login" onClick={() => openLoginDialog()}>
            <Icon name="icon-userlogin"></Icon>
          </div>未登录<span className="leftbar-triangle"></span>
        </div>
      }
      <div styleName="leftbar-playlist">
        <NavLink to={{ pathname: '/home', state: { needLogin: true }}} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon name="icon-neteastmusic"></Icon>发现音乐
        </NavLink>
        <NavLink to={'/fm'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon fontSize={14} name="iconxinhao"></Icon>私人FM
        </NavLink>
        <NavLink to={'/video'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon name="icon-mv"></Icon>视频
        </NavLink>
        <NavLink to={'/activity'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon name="iconfriend"></Icon>朋友
        </NavLink>
        <div styleName="leftbar-item-title">我的音乐</div>
        <NavLink to={'/cloud'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon name="icon-cloud"></Icon>我的音乐云盘
        </NavLink>
        <NavLink to={'/star'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon name="icon-star"></Icon>我的收藏
        </NavLink>
        <NavLink to={'/history'} activeClassName="leftbar-item-active" styleName="leftbar-item">
          <Icon fontSize={17} name="icon-history"></Icon>播放历史
        </NavLink>
        <div styleName="leftbar-item-title">
          创建的歌单
          <Icon className="icon-color-3 hover" onClick={() => createDialogProps.toggle()} name="icon-add"></Icon>
        </div>
        {
          !isLogin ?
          (
            <div styleName="leftbar-item" onClick={() => openLoginDialog()}>
              <Icon name="iconxin"></Icon>我喜欢的音乐
            </div>
          ) :
          userPlaylist.map(item => (
            <ContextMenuWrap key={item.id} id={MENU_NAME} menu={getPlaylistMenu(item)}>
              <NavLink onClick={() => { setPlaylistCacheOnce(item) }} key={item.id} to={`/playlist/${item.id}`} activeClassName="leftbar-item-active" styleName="leftbar-item">
                <Icon name={`${isMyFavotitePlaylist(item.id) ? 'iconxin' : 'icon-playlist'}`}></Icon>
                <div>{item.name}</div>
              </NavLink>
            </ContextMenuWrap>
          ))
        }
        { !!subPlaylist.length && <div styleName="leftbar-item-title">收藏的歌单</div> }
        {
          subPlaylist.map(item => (
            <ContextMenuWrap key={item.id} id={MENU_NAME} menu={getPlaylistMenu(item)}>
              <NavLink onClick={() => { setPlaylistCacheOnce(item) }} key={item.id} to={`/playlist/${item.id}`} activeClassName="leftbar-item-active" styleName="leftbar-item">
                <Icon name="icon-playlist"></Icon><div>{item.name}</div>
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