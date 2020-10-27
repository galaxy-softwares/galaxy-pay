import { Action } from 'redux'

export interface UserState {
  username: string
  avatar: string
  git_token: string
  work_path: string
  id: string
}

const SETUSER = 'SETUSER'

type SETUSER = typeof SETUSER

interface SetUser extends Action<SETUSER> {
  payload: Partial<UserState>
}

export const setUser = (payload: Partial<UserState>): SetUser => ({
  type: 'SETUSER',
  payload
})

export type UserAction = SetUser

// export const UserInfoAsync = (form: FormInstance): ThunkAction<Promise<void>, AppState, null, SetUser> => {
//     return async dispatch => {
//         const { data } = await userGetInfo()
//         if (data) {
//             dispatch(
//                 setUser({
//                     username: data.username,
//                     avatar: data.avatar,
//                     id: data.id
//                 })
//             )
//             form.setFieldsValue({
//                 ...data
//             })
//         }
//     }
// }
