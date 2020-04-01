import { PanelType } from 'VIEWS/panel/container'

export const SET_PANEL_TYPE = 'SET_PANEL_TYPE'
export const SET_FAVORITE_IDS = 'SET_FAVORITE_IDS'

interface setPanelType {
  type: typeof SET_PANEL_TYPE
  panelType: PanelType
}

interface setFavoriteIds {
  type: typeof SET_FAVORITE_IDS
  favoriteIds: number[]
}

export interface CommenState {
  panelType: PanelType
  favoriteIds: number[]
}

export type CommenActionTypes = setPanelType | setFavoriteIds
