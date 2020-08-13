import { request } from "../utils/request"
import { LoginParams, LoginResult } from "../interface/user/login";
import { UserInfo } from "../interface/user/userinfo";

export const login = (data: LoginParams) => request<LoginResult>('post', '/auth/login', data);

export const userGetInfo = () => request<UserInfo>('post', '/user/userByToken',{ token: localStorage.getItem('token') })

export const userUpdateInfo = (id, data) => request<UserInfo>('put', `/user/${id}`, data)

export const uploadFile = (file) => {
    const data = new FormData();
    data.append("file", file);
    return request('post', '/file/uploadImage', data)
}