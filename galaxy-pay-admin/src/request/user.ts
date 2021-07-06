import { UserIF } from '../interface/user.interface'
import { request } from '../utils/request'

export const login = (data: UserIF.LoginParams) => request<UserIF.LoginResult>('post', '/auth/login', data)

export const userGetInfo = () =>
  request<UserIF.UserInfo>('post', '/user/userByToken', { token: localStorage.getItem('token') })

export const userUpdateInfo = (id, data) => request<UserIF.UserInfo>('put', `/user/${id}`, data)

export const uploadFile = file => {
  const formData = new FormData()
  formData.append('file', file)
  return request('post', '/file/uploadP12', formData)
}
