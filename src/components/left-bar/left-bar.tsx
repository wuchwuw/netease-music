import React from 'react'
import './left-bar.less'
import { NavLink } from 'react-router-dom'
import { useDialog, LoginDialog } from 'COMPONENTS/dialog/index'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import { useContainer } from 'COMPONENTS/container/container'
import AddPlaylistDialog from 'COMPONENTS/dialog/add-playlist/add-playlist-dialog'
import { ContextMenuTrigger, ContextMenu, MenuItem, connectMenu } from 'react-contextmenu'
import { usePlaylistContextMenu, MenuType } from 'UTIL/menu'
import { useUserPlaylist } from 'UTIL/user-playlist'

const MENU_NAME = 'left-bar-contextmenu'
let target: HTMLElement | null = null

const Menu = ({id, trigger}: any) => {
  const menu: MenuType[] = trigger && trigger.menu || []
  return (
    <ContextMenu 
      id={id} 
      className="context-menu"
      onHide={() => {
        target && target.classList.remove('context-menu-leftbar-selected') 
      }} 
      onShow={(e) => {
        target = e.detail.target
        target && target.classList.add('context-menu-leftbar-selected') 
      }}
    >
      {
        menu.map((item) => (
          <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => { item.trigger && item.trigger() }} data={{ action: 'Added' }}>{item.name}</MenuItem>
        ))
      }
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu(MENU_NAME)(Menu);

const LeftBar: React.SFC = () => {
  const loginDialogProps = useDialog()
  const addDialogProps = useDialog()
  const user = useSelector((state: RootState) => state.user.user)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const { visiable, open  } = useContainer(['.leftbar-user-panel'])
  const { getPlaylistMenu } = usePlaylistContextMenu()
  const { userPlaylist, subPlaylist, isMyFavotitePlaylist } = useUserPlaylist()

  return (
    <div className='leftbar-wrap'>
      {
        isLogin ?
        <div className="leftbar-user">
          <div className="leftbar-login">
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
                  <div><i className="iconfont icon-logout"></i>退出登录</div>
                </div>
              </div>
            }
          </div>
        </div>
        :
        <div className="leftbar-user">
          <div className="leftbar-login" onClick={() => loginDialogProps.toggle()}><i className="iconfont icon-userlogin"></i></div>未登录<span className="leftbar-triangle"></span>
        </div>
      }
      <div className="leftbar-playlist">
        <NavLink to={'/home'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-neteastmusic" style={{ fontWeight: 100 }}></i>发现音乐
        </NavLink>
        <NavLink to={'/fm'} activeClassName="active" className="leftbar-item">
          <i className="iconfont iconxinhao" style={{ fontWeight: 100 }}></i>私人FM
        </NavLink>
        <NavLink to={'/video'} activeClassName="active" className="leftbar-item">
          <i className="iconfont icon-mv" style={{ fontWeight: 100 }}></i>视频
        </NavLink>
        <NavLink to={'/activity'} activeClassName="active" className="leftbar-item">
          <i className="iconfont iconfriend" style={{ fontWeight: 100 }}></i>朋友
        </NavLink>
        {/* <div className="leftbar-item-title">我的音乐</div>
        <div className="leftbar-item"><i className="iconfont iconfriend"></i>朋友</div> */}
        <div className="leftbar-item-title">创建的歌单<i onClick={() => addDialogProps.toggle()} className="iconfont icon-add"></i></div>
        {
          userPlaylist.map(item => (
            <ContextMenuTrigger id={MENU_NAME} menu={getPlaylistMenu(item)} collect={props => props}>
              <NavLink key={item.id} to={`/playlist/${item.id}`} activeClassName="active" className="leftbar-item">
                <i className={`iconfont ${isMyFavotitePlaylist(item.id) ? 'iconxin' : 'icon-playlist'}`}></i><div>{item.name}</div>
              </NavLink>
            </ContextMenuTrigger>
          ))
        }
        <div className="leftbar-item-title">收藏的歌单</div>
        {
          subPlaylist.map(item => (
            <ContextMenuTrigger id={MENU_NAME} menu={getPlaylistMenu(item)} collect={props => props}>
              <NavLink key={item.id} to={`/playlist/${item.id}`} activeClassName="active" className="leftbar-item">
                <i className="iconfont icon-playlist"></i><div>{item.name}</div>
              </NavLink>
            </ContextMenuTrigger>
          ))
        }
      </div>
      <LoginDialog {...loginDialogProps}></LoginDialog>
      <AddPlaylistDialog {...addDialogProps}></AddPlaylistDialog>
      <ConnectedMenu></ConnectedMenu>
    </div>
  )
}

export default LeftBar