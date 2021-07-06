import { CustomerFormColumns } from '../../components/CustomFrom/customForm'
import { getSoftwares } from '../../request/software'

// 初始化自定义表单数据
export const initPayappCustomerBasicForm = async (): Promise<CustomerFormColumns> => {
  const { data } = await getSoftwares()
  payappCustomerBasicForm[1].options = data.map(({ id, name }) => {
    return { value: id, text: name }
  })
  return payappCustomerBasicForm
}

export const payappCustomerBasicForm: CustomerFormColumns = [
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
    editDisable: true,
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

export const payappCustomerWechatForm: CustomerFormColumns = [
  {
    label: 'appid',
    valueType: 'Input',
    placeholder: '微信开放平台审核通过应用的APPID',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'appid',
      rules: [{ required: true, message: 'appid不能为空' }]
    }
  },
  {
    label: 'mch_id',
    valueType: 'Input',
    placeholder: '微信支付分配的商户号id',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'mch_id',
      rules: [{ required: true, message: '商户号不能为空' }]
    }
  },
  {
    label: 'mch_key',
    valueType: 'Input',
    placeholder: '微信支付商户key',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'mch_key',
      rules: [{ required: true, message: '微信支付商户key不能为空' }]
    }
  },
  {
    label: 'app_secret',
    valueType: 'Input',
    placeholder: '开发者支付密钥',
    col: 12,
    editDisable: true,
    customformItemPros: {
      name: 'app_secret',
      rules: [{ required: true, message: '开发者支付密钥不能为空' }]
    }
  }
]

// 支付宝公钥
export const payappCustomerAlipayForm: CustomerFormColumns = [
  {
    label: 'appid',
    valueType: 'Input',
    placeholder: '支付宝开放平台审核通过的应用APPID',
    col: 12,
    customformItemPros: {
      name: 'appid',
      rules: [{ required: true, message: 'appid 不能为空' }]
    }
  },
  {
    label: '支付宝应用私钥 private_key',
    valueType: 'Input',
    placeholder: '支付宝应用私钥',
    col: 12,
    customformItemPros: {
      name: 'private_key',
      rules: [{ required: true, message: '请输入支付宝 private_key' }]
    }
  },
  {
    label: '支付宝公钥 public_key',
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
export const payappCustomerAlipayCertificateForm: CustomerFormColumns = [
  {
    label: 'appid',
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
  }
]

export const payappParamsForm: CustomerFormColumns = [
  {
    label: '应用名称',
    valueType: 'Input',
    placeholder: '请输入应用名称',
    col: 24,
    customformItemPros: {
      name: 'name',
      prefixCls: ''
    }
  },
  {
    label: '支付通道',
    valueType: 'Select',
    editDisable: true,
    placeholder: '请选择归属项目',
    col: 24,
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
      name: 'channel'
    }
  }
]
