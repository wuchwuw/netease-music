import React, { useEffect } from "react"
import CurrentPlaylist from 'VIEWS/panel/current-playlist/current-playlist'
import Search from 'VIEWS/panel/search/search'
import Message from 'VIEWS/panel/message/message'
import { useDispatch, useSelector } from "react-redux"
import { SET_PANEL_TYPE } from 'STORE/commen/types'
import { RootState } from "STORE/index"
import Chat from "./chat/chat"

export enum PanelType {
  Search = 'search',
  CurrentPlaylist = 'current-playlist',
  Message = 'message',
  Chat = 'chat',
  Close = 'close'
}

export function usePanelContaienr () {
  const dispatch = useDispatch()
  const currentPanelType = useSelector((state: RootState) => state.commen.panelType)
  function setPanelType (type: PanelType) {
    dispatch({ type: SET_PANEL_TYPE, panelType: type })
  }
  return {
    currentPanelType,
    setPanelType
  }
}

const PanelContainer: React.SFC = (props) => {
  const dispatch = useDispatch()
  const panelType = useSelector((state: RootState) => state.commen.panelType)
  const nodeList = [
    document.querySelector('.panel-container'),
    document.querySelector('.bottom'),
    document.querySelector('.topbar-search-content'),
    document.querySelector('#message-icon')
  ]

  function genPanelNode (type: PanelType) {
    switch (type) {
      case PanelType.Search:
        return <Search></Search>
      case PanelType.CurrentPlaylist:
        return <CurrentPlaylist></CurrentPlaylist>
      case PanelType.Message:
        return <Message></Message>
      case PanelType.Chat:
        return <Chat></Chat>
      case PanelType.Close:
        return null
    }
  }

  function onCurrentPlaylistClick (e: MouseEvent) {
    const isContain = nodeList.some(value => {
      return value!.contains((e.target as Node))
    })
    if (isContain) return
    dispatch({ type: SET_PANEL_TYPE, panelType: PanelType.Close })
  }

  useEffect(() => {
    if (panelType !== 'close') {
      document.addEventListener('click', onCurrentPlaylistClick)
    }
    return () => {
      document.removeEventListener('click', onCurrentPlaylistClick)
    }
  }, [panelType])

  return (
    <div className="panel-container">
      { genPanelNode(panelType) }
    </div>
  )
}

export default PanelContainer