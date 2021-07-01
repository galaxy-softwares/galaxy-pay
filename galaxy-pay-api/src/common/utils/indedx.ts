const qs = require('qs')
const md5 = require('md5')
const path = require('path')

/**
 * 生成签名
 * @param param
 * @param key
 */
export const makeSignStr = (param: Object, key: string) => {
  const params = sortByKey(param)
  const param_url = qs.stringify(params)
  let param_str = `${param_url}&key=${key}`
  param_str = md5(param_str.toLocaleLowerCase())
  param_str = param_str.toLocaleUpperCase()
  return `${param_str}`
}

export const joinPath = file => {
  return path.join(__dirname, `../../../${file}`)
}

/**
 * 排序
 * @param obj
 */
export const sortByKey = (obj: Object) => {
  const newkey = Object.keys(obj).sort()
  const newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

/**
 * 生成随机字符串
 * @param chars
 * @returns
 */
export const randomString = (chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string => {
  let result = ''
  for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
