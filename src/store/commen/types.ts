import { PanelType } from 'VIEWS/panel/container'

export const SET_PANEL_TYPE = 'SET_PANEL_TYPE'
export const SET_FAVORITE_IDS = 'SET_FAVORITE_IDS'
export const SET_SEARCH_KEYWORDS = 'SET_SEARCH_KEYWORDS'
export const SET_HISTORY_KEYWORDS = 'SET_HISTORY_KEYWORDS'

interface setPanelType {
  type: typeof SET_PANEL_TYPE
  panelType: PanelType
}

interface setFavoriteIds {
  type: typeof SET_FAVORITE_IDS
  favoriteIds: number[]
}

export interface setSearchKeyword {
  type: typeof SET_SEARCH_KEYWORDS
  keywords: string
}

export interface setHistoryKeywords {
  type: typeof SET_HISTORY_KEYWORDS
  keywords: string
}


export interface CommenState {
  panelType: PanelType
  favoriteIds: number[]
  keywords: string
  historyKeywords: string[]
}

export type CommenActionTypes = setPanelType | setFavoriteIds | setSearchKeyword | setHistoryKeywords
