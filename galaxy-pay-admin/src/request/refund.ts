import { request } from '../utils/request'

export const refundGetList = () => request('get', '/refund')
