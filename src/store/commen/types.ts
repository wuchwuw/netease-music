export const SET_PANEL_TYPE = 'SET_PANEL_TYPE'

interface setPanelType {
  type: typeof SET_PANEL_TYPE
  panelType: string
}

export interface CommenState {
  panelType: string
}

export type CommenActionTypes = setPanelType
