import { request } from '../utils/request'

export const createPayapp = data => request('post', '/payapp', data)

export const updatePayapp = data => request('put', '/payapp', data)

export const getPayapp = () => request('get', '/payapp')
