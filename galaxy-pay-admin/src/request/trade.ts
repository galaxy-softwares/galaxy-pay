import { request } from '../utils/request'

export const tradeGetList = () => request('get', '/trade')
