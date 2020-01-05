import React, { useEffect } from "react"
import CurrentPlaylist from 'VIEWS/panel/current-playlist/current-playlist'
import Search from 'VIEWS/panel/search/search'
import Message from 'VIEWS/panel/message/message'
import { useDispatch, useSelector } from "react-redux"
import { SET_PANEL_TYPE } from 'STORE/commen/types'
import { RootState } from "STORE/index"

const PanelContainer: React.SFC = (props) => {
  const dispatch = useDispatch()
  const panelType = useSelector((state: RootState) => state.commen.panelType)
  const nodeList = [
    document.querySelector('.panel-container'),
    document.querySelector('.bottom'),
    document.querySelector('.topbar-search-content')
  ]

  function genPanelNode (type: string) {
    return <Message></Message>
    // switch (type) {
    //   case 'search':
    //     return <Search></Search>
    //   case 'current-playlist':
    //     return <CurrentPlaylist></CurrentPlaylist>
    //   case 'message':
    //     return <Message></Message>
    //   case 'close':
    //     return null
    // }
  }

  function onCurrentPlaylistClick (e: MouseEvent) {
    const isContain = nodeList.some(value => {
      return value!.contains((e.target as Node))
    })
    if (isContain) return
    dispatch({ type: SET_PANEL_TYPE, panelType: 'close' })
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