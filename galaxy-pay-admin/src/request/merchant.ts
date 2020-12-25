import { request } from '../utils/request'

export const merchantGetList = () => request('get', '/merchant')

export const merchantCreateInfo = data => request('post', '/merchant', data)

export const merchantDelete = id => request('delete', `/merchant/${id}`)
