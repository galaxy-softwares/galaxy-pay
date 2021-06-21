import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  activeMenu: {
    menuIndex: 0,
    path: '/'
  },
  menuBreadcrumb: [],
  visible: false
}

const appStore = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMenu(state, action: PayloadAction<any>) {
      state.activeMenu = action.payload
    },
    setVisible(state, action: PayloadAction<any>) {
      state.visible = action.payload
    },
    setMenuBreadcrumb(state, action: PayloadAction<any>) {
      state.menuBreadcrumb = action.payload
    }
  }
})

export const { setMenu, setVisible, setMenuBreadcrumb } = appStore.actions

export default appStore.reducer
