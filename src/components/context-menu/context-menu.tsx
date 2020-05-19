import React from 'react'
import { ContextMenuTrigger, ContextMenu, MenuItem, SubMenu, connectMenu } from 'react-contextmenu'
import { MenuType } from 'UTIL/menu'

let target: HTMLElement | null = null

const Menu = ({id, trigger}: any) => {
  const menu: MenuType[] = trigger && trigger.menu || []
  return (
    <ContextMenu
      id={id}
      className="context-menu"
      onHide={() => {
        target && target.classList.remove('context-menu-musiclist-selected')
      }}
      onShow={(e) => {
        target = e.detail.target
        target && target.classList.add('context-menu-musiclist-selected')
      }}
    >
      {
        menu.map((item) => {
          return (
            item.sub ?
              <SubMenu title={<div>收藏<i className="iconfont icon-triangle-full"></i></div>} attributes={{className: 'context-menu-item'}}>
                {
                  item.sub.map(menu => (
                    <MenuItem attributes={{className: 'context-menu-item'}} onClick={ () => { menu.trigger && menu.trigger() } }>{menu.name}</MenuItem>
                  ))
                }
              </SubMenu>
              :
              <MenuItem attributes={{className: 'context-menu-item'}} onClick={ () => { item.trigger && item.trigger() } } data={{ action: 'Added' }}>{item.name}</MenuItem>

          )
        })
      }
    </ContextMenu>
  )
}

interface ContextMenuWrapProps {
  id: string
  menu: MenuType[]
}

export const ContextMenuWrap: React.SFC<ContextMenuWrapProps> = (props) => {
  return (
    <ContextMenuTrigger
      id={props.id}
      menu={props.menu}
      collect={props => props}
    >
      { props.children}
    </ContextMenuTrigger>
  )
}

export const ConnectedMenu = (id: string) => {
  return connectMenu(id)(Menu)
}
