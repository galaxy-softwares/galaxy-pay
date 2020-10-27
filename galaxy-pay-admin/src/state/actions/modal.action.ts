import { Action } from 'redux'

const SEVISIBLE = 'SEVISIBLE'

type SEVISIBLE = typeof SEVISIBLE

interface SetVisible extends Action<SEVISIBLE> {
  payload: boolean
}

export const setVisible = (payload: boolean): SetVisible => ({
  type: 'SEVISIBLE',
  payload
})

export type ModalActions = SetVisible
