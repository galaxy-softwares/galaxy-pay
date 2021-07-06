import { Button, Form } from 'antd'
import React, { FC } from 'react'
import { CustomerFormColumns, CustomForm } from '../CustomFrom/customForm'

export const FormPopoverContent: FC<{
  columns: CustomerFormColumns
  callback: (values) => void
}> = ({ columns, callback }) => {
  const [form] = Form.useForm()

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        callback(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <div className="margin__bottom__20">
      <Form preserve={false} form={form} layout="vertical">
        <CustomForm isEdit={false} columns={columns} />
        <Button type="primary" onClick={onSubmit}>
          查询
        </Button>
      </Form>
    </div>
  )
}
