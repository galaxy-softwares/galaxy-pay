import { request } from '../utils/request'

export const getSoftwares = () => request('get', '/software')

export const getSoftware = id => request('get', `/software/${id}`)

export const createSoftware = data => request('post', '/software', data)

export const softwareUpdateInfo = data => request('put', '/software', data)

/**
 * 查询项目详情
 * @param id number
 */
export const softwareDetail = (id: string, chanle: string) => request<any>('get', `/software/${id}/${chanle}`)
