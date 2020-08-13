import { Action } from 'redux';

export interface MenuState {
    title: string,
    softName: string,
    menuIndex: number,
    softId: number,
    path: string
}

const SETMENU = 'SETMENU'

type SETMENU = typeof SETMENU

interface SetMenu extends Action<SETMENU>{
    payload: Partial<MenuState>
}

export const setMenu = (payload: Partial<MenuState>): SetMenu => ({
    type: 'SETMENU',
    payload
})

export type MenuActions = SetMenu
