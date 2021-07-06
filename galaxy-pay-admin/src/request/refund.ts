import { request } from '../utils/request'

export const getRefundList = parmams => request('get', '/refund', parmams)
