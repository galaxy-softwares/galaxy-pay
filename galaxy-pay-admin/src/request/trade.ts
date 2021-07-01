import { request } from '../utils/request'

export const getTradeList = () => request('get', '/trade')
