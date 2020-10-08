var qs = require('qs');
var md5 = require('md5');
/**
 * 生成签名
 * @param param
 * @param key 
 */
export const makeSignStr = (param: Object, key: string) => {
    let params = sortByKey(param);
    let param_url = qs.stringify(params)
    let param_str = `${param_url}&key=${key}`;
    param_str = md5(param_str.toLocaleLowerCase())
    param_str = param_str.toLocaleUpperCase();
    return `${param_str}`;
}

/**
 * 排序
 * @param obj 
 */
export const  sortByKey = (obj: Object) => {
    const newkey = Object.keys(obj).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
}