import { request } from '../utils/request'

export const createPayapp = data => request('post', '/payapp', data)

export const getPayapp = (id: number) => request('get', `/payapp/${id}`)

export const updatePayapp = data => request('put', '/payapp', data)

export const getPayapps = () => request('get', '/payapp')

// const columns = [
//   {
//     label: '应用名称',
//     name: 'name',
//     valueType: 'Input',
//     placeholder: '请输入应用名称',
//     tooltip: '',
//     col: 8,
//     formItemProps: {
//       rules: [{ required: true, message: '请输入应用名称' }]
//     }
//   },
//   {
//     label: '应用名称',
//     name: 'software_id',
//     valueType: 'Input',
//     placeholder: '请选择归属项目',
//     tooltip: '',
//     col: 8,
//     formItemProps: {
//       rules: [{ required: true, message: '请选择归属项目' }]
//     }
//   },
//   {
//     label: '应用类型',
//     name: 'pay_app_type',
//     valueType: 'Input',
//     placeholder: '请选择应用类型',
//     tooltip: '',
//     col: 8,
//     formItemProps: {
//       rules: [{ required: true, message: '请选择归属项目' }]
//     }
//   },
//   {
//     label: '支付通知地址',
//     name: 'pay_app_type',
//     valueType: 'Input',
//     placeholder: '请选择应用类型',
//     tooltip: '支付完成时, 支付系统通知地址',
//     col: 12,
//     formItemProps: {
//       rules: [{ required: true, message: '支付完成时, 支付系统通知地址' }]
//     }
//   }
// ]
