import { request } from '../utils/request'

export const createPayapp = data => request('post', '/payapp', data)

export const getPayapp = (id: number) => request('get', `/payapp/${id}`)

export const updatePayapp = data => request('put', '/payapp', data)

export const getPayapps = params => request('get', '/payapp', params)
