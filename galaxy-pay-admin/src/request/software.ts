import { SoftwareIF } from '../interface/software.interface'
import { request } from '../utils/request'

export const getSoftwares = () => request<SoftwareIF.SoftwareList>('get', '/software')

export const getSoftware = (id: number) => request('get', `/software/${id}`)

export const createSoftware = (data: SoftwareIF.Software) => request('post', '/software', data)

export const deleteSoftware = (id: number) => request('delete', `/software/${id}`)

export const softwareUpdateInfo = (data: SoftwareIF.SoftwareEdit) => request('put', '/software', data)

/**
 * 查询项目详情
 * @param id number
 */
export const softwareDetail = (id: string, chanle: string) =>
  request<SoftwareIF.Software>('get', `/software/${id}/${chanle}`)
