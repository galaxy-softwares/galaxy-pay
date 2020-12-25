import React, { useState } from 'react'
import { Form, Input, Radio } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/es/form'
import { UploadFile } from './uploadFile'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

interface Merchant {
  form: FormInstance
}

export const MerchantForm: React.FC<Merchant> = ({ form }) => {
  const [formChannel, setFormChannel] = useState('wechat')

  const handleChange = data => {
    if (data) {
      form.setFieldsValue({
        apiclient_cert: data.path
      })
    }
  }

  const onFormChange = e => {
    setFormChannel(e.target.value)
  }

  return (
    <div>
      <Form
        preserve={false}
        {...layout}
        form={form}
        initialValues={{
          channel: formChannel
        }}
      >
        <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '项目名称不能为空' }]}>
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item name="channel" label="支付通道" rules={[{ required: false, message: '请选择通道' }]}>
          <Radio.Group onChange={onFormChange}>
            <Radio value="wechat">微信</Radio>
            <Radio value="alipay">支付宝</Radio>
          </Radio.Group>
        </Form.Item>
        {formChannel === 'wechat' ? (
          <>
            <Form.Item name="mch_id" label="MCHID" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="微信支付分配的商户号id" />
            </Form.Item>
            <Form.Item name="mch_key" label="MCH_KEY" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="微信支付密钥" />
            </Form.Item>
            <Form.Item name="apiclient_cert" label="apiclient_cert">
              <Input
                placeholder="证书文件，特定操作需要,譬如打款功能！"
                addonAfter={
                  <UploadFile uploadSuccess={handleChange} accept={'*'} uploadFail={null}>
                    <CloudUploadOutlined />
                  </UploadFile>
                }
              />
            </Form.Item>
          </>
        ) : (
          <></>
        )}
        {formChannel === 'alipay' ? (
          <>
            <Form.Item name="public_key" label="支付宝公钥" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="支付宝公钥" />
            </Form.Item>
            <Form.Item name="private_key" label="支付宝私钥" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="支付宝私钥" />
            </Form.Item>
          </>
        ) : (
          <></>
        )}
      </Form>
    </div>
  )
}
