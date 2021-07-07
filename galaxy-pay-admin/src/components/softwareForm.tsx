import React from 'react'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'

interface Merchant {
  form: FormInstance
}

export const SoftwareForm: React.FC<Merchant> = ({ form }) => {
  return (
    <Form preserve={false} layout="vertical" form={form}>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
        <Input placeholder="请输入项目名称" />
      </Form.Item>
    </Form>
  )
}
