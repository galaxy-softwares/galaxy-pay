import { request } from '../utils/request'

export const getTradeList = parmams => request('get', '/trade', parmams)
