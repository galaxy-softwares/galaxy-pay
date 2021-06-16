import React, { useState } from 'react'
import { Form, Input, Select } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/es/form'
import { UploadFile } from './uploadFile'
const { Option } = Select

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

  // const onFormChange = e => {
  //   setFormChannel(e.target.value)
  // }

  return (
    <div>
      <Form
        preserve={false}
        layout="vertical"
        form={form}
        initialValues={{
          channel: formChannel
        }}
      >
        <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '项目名称不能为空' }]}>
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item name="channel" label="支付通道" rules={[{ required: true }]}>
          <Select placeholder="请选择支付通道" allowClear>
            <Option value="wechat">微信</Option>
            <Option value="alipay">支付宝</Option>
          </Select>
        </Form.Item>
        {formChannel === 'wechat' ? (
          <>
            <Form.Item name="mch_id" label="MCHID" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="微信支付分配的商户号id" />
            </Form.Item>
            <Form.Item name="mch_key" label="MCH_KEY" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="微信支付密钥" />
            </Form.Item>
            <Form.Item name="apiclient_cert" label="apiclient_cert" required>
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
