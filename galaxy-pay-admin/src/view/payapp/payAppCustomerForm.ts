import { Columns } from '../../components/CustomFrom/customForm'

export const payappCustomerBasicForm: Columns = [
  {
    label: '应用名称',
    valueType: 'Input',
    placeholder: '请输入应用名称',
    col: 8,
    customformItemPros: {
      name: 'name',
      tooltip: '',
      rules: [{ required: true, message: '请输入应用名称' }]
    }
  },
  {
    label: '应用名称',
    valueType: 'Select',
    placeholder: '请选择归属项目',
    col: 8,
    options: [],
    customformItemPros: {
      name: 'software_id',
      tooltip: '',
      rules: [{ required: false, message: '请选择归属项目' }]
    }
  },
  {
    label: '支付通道',
    valueType: 'Select',
    placeholder: '请选择归属项目',
    col: 8,
    options: [
      {
        value: 'wechat',
        text: '微信支付'
      },
      {
        value: 'alipay',
        text: '支付宝'
      }
    ],
    customformItemPros: {
      name: 'channel',
      rules: [{ required: true, message: '请选择支付通道' }]
    }
  },
  {
    label: '支付通知地址',
    valueType: 'Input',
    placeholder: '"支付完成时, 支付系统通知地址',
    col: 12,
    customformItemPros: {
      name: 'notify_url',
      tooltip: '支付完成时, 支付系统通知地址',
      rules: [{ required: true, message: '请输入notify_url' }]
    }
  },
  {
    label: '回调地址',
    valueType: 'Input',
    placeholder: '支付完成后跳转页面,PC端 支付必填！',
    col: 12,
    customformItemPros: {
      name: 'callback_url',
      tooltip: '支付完成时, 本系统回调地址'
    }
  },
  {
    label: '跳转地址',
    valueType: 'Input',
    placeholder: '支付完成后跳转页面,PC端 支付必填！',
    col: 24,
    customformItemPros: {
      name: 'return_url',
      tooltip: '当支付完成时，进行的网页跳转。APP和小程序则无需填写'
    }
  },

  {
    label: '授权域名',
    valueType: 'Input',
    placeholder: '授权域名,非授权域名则无法成功调用支付, 多个域名用逗号隔开。不限制则填写 *',
    col: 24,
    customformItemPros: {
      name: 'domain_url',
      tooltip: '当支付完成时，进行的网页跳转。APP和小程序则无需填写',
      rules: [{ required: true, message: '授权域名不能为空' }]
    }
  }
]

export const payappCustomerWechatForm: Columns = [
  {
    label: 'APPID',
    valueType: 'Input',
    placeholder: '微信开放平台审核通过应用的APPID',
    col: 12,
    customformItemPros: {
      name: 'appid',
      rules: [{ required: true, message: '项目名称不能为空' }]
    }
  },
  {
    label: 'MCHID',
    valueType: 'Input',
    placeholder: '微信支付分配的商户号id',
    col: 12,
    customformItemPros: {
      name: 'mch_id',
      rules: [{ required: true, message: '商户号不能为空' }]
    }
  },
  {
    label: 'MCH_KEY',
    valueType: 'Input',
    placeholder: '微信支付密钥',
    col: 12,
    customformItemPros: {
      name: 'mch_key',
      rules: [{ required: true, message: '微信支付密钥' }]
    }
  },
  {
    label: 'APP_KEY',
    valueType: 'Input',
    placeholder: '开发者支付密钥',
    col: 12,
    customformItemPros: {
      name: 'app_secret',
      rules: [{ required: true, message: '开发者支付密钥不能为空' }]
    }
  },
  {
    label: 'apiclient_cert',
    valueType: 'Input',
    placeholder: '证书文件，特定操作需要！',
    col: 24,
    customformItemPros: {
      name: 'apiclient_cert',
      rules: [{ required: true, message: '开发者支付密钥不能为空' }]
    }
  }
]

// 支付宝公钥
export const payappCustomerAlipayForm: Columns = [
  {
    label: 'APPID',
    valueType: 'Input',
    placeholder: '支付宝开放平台审核通过的应用APPID',
    col: 12,
    customformItemPros: {
      name: 'appid',
      rules: [{ required: true, message: 'appid 不能为空' }]
    }
  },
  {
    label: '支付宝应用私钥',
    valueType: 'Input',
    placeholder: '支付宝应用私钥',
    col: 12,
    customformItemPros: {
      name: 'private_key',
      rules: [{ required: true, message: '请输入支付宝 private_key' }]
    }
  },
  {
    label: '支付宝公钥',
    valueType: 'Input',
    placeholder: '支付宝公钥',
    col: 24,
    editDisable: true,
    customformItemPros: {
      name: 'public_key',
      rules: [{ required: true, message: '请输入支付宝 public_key' }]
    }
  }
]

// 支付宝公钥证书
export const payappCustomerAlipayCertificateForm: Columns = [
  {
    label: 'APPID',
    valueType: 'Input',
    placeholder: '支付宝开放平台审核通过的应用APPID',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'appid',
      rules: [{ required: true, message: 'appid 不能为空' }]
    }
  },
  {
    label: '支付宝私钥',
    valueType: 'Input',
    placeholder: '支付宝私钥',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'private_key',
      rules: [{ required: true, message: '请输入支付宝 private_key' }]
    }
  },
  {
    label: '应用公钥证书 app_cert_public_key',
    valueType: 'Input',
    placeholder: '应用公钥证书 app_cert_public_key',
    col: 24,
    editDisable: true,
    customformItemPros: {
      name: 'app_cert_public_key',
      rules: [{ required: true, message: '请上传支付宝应用公钥！' }]
    }
  },
  {
    label: '支付宝公钥证书 alipay_cert_public_key_rsa2',
    valueType: 'Input',
    placeholder: '支付宝公钥证书 alipay_cert_public_key_rsa2',
    col: 24,
    editDisable: true,
    customformItemPros: {
      name: 'alipay_cert_public_key_rsa2',
      rules: [{ required: true, message: '请上传支付宝公钥证书！' }]
    }
  },
  {
    label: '支付宝根证书 alipay_root_cert',
    valueType: 'Input',
    placeholder: '支付宝根证书 alipay_root_cert',
    col: 24,
    editDisable: true,
    customformItemPros: {
      name: 'alipay_root_cert',
      rules: [{ required: true, message: '请上传支付宝根证书！' }]
    }
  }
]
