import { PanelType } from 'VIEWS/panel/container'

export const SET_PANEL_TYPE = 'SET_PANEL_TYPE'

interface setPanelType {
  type: typeof SET_PANEL_TYPE
  panelType: PanelType
}

export interface CommenState {
  panelType: PanelType
  favoriteIds: number[]
}

export type CommenActionTypes = setPanelType
