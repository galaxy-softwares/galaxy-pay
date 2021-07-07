import { PayappIF } from '../interface/payapp.interface'
import { request } from '../utils/request'

export const createPayapp = (data: PayappIF.Payapp) => request('post', '/payapp', data)

export const getPayapp = (id: number) => request<Required<PayappIF.Payapp>>('get', `/payapp/${id}`)

export const updatePayapp = (data: Required<PayappIF.Payapp>) => request('put', '/payapp', data)

export const getPayapps = (params: PayappIF.PayappParams) => request<PayappIF.PayappList>('get', '/payapp', params)

export const deletePayapp = (pay_app_id: string) => request('delete', `/payapp/${pay_app_id}`)
