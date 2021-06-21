import React from 'react'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'

interface Merchant {
  form: FormInstance
}

export const SoftwareForm: React.FC<Merchant> = ({ form }) => {
  return (
    <Form preserve={false} layout="vertical" form={form}>
      <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
        <Input placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item name="logo" label="logo" rules={[{ required: true, message: 'callback_url' }]}>
        <Input placeholder="logo" />
      </Form.Item>
      <Form.Item name="callback_url" label="callback_url" rules={[{ required: true, message: 'callback_url' }]}>
        <Input placeholder="callback_url" />
      </Form.Item>
      <Form.Item name="return_url" label="return_url">
        <Input placeholder="return_url" />
      </Form.Item>
    </Form>
  )
}
