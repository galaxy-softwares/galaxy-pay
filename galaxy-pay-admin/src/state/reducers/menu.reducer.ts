import { MenuActions } from "../actions/menu.actions";

const menuState = {
    softName: '',
    menuIndex: 0,
    title: '项目管理',
    softId: 0,
    path: '/',
}

export const menuReducer = (state = menuState, actions: MenuActions) => {
    switch (actions.type) {
        // 点击菜单栏的时候
        case 'SETMENU':
            return { ...state, ...actions.payload }
        default:
            return state
    }
}
