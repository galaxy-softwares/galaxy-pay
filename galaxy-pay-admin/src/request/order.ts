import { request } from "../utils/request";

export const orderGetList = () => request('get', '/order');

