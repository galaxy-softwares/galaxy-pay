import { request } from "../utils/request";

export const softwareGetList = () => request('get', '/software');

export const softwareCreateInfo = (data) => request('post', '/software', data);

export const softwareUpdateInfo = (data) => request('put', '/software', data);

/**
 * 查询项目详情
 * @param id number
 */
export const softwareDetail = (id:string, chanle: string) => request<any>('get', `/software/${id}/${chanle}`);
