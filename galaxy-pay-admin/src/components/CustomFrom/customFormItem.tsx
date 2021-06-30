import React, { FC } from 'react'
import { Col, Form, Input, Select } from 'antd'
import { CustomFormItemIF, CustomSelectOption } from './customForm'
const { Option } = Select

interface formItem {
  customFormItem: CustomFormItemIF
}
export const CustomFormItem: FC<formItem> = ({ customFormItem }) => {
  const { label } = customFormItem
  customFormItem.customformItemPros.label = label

  const InputRender = (customFormItem: CustomFormItemIF): JSX.Element => {
    return (
      <Form.Item {...customFormItem.customformItemPros}>
        <Input placeholder={customFormItem.placeholder} />
      </Form.Item>
    )
  }

  const selectRender = (customFormItem: CustomFormItemIF): JSX.Element => {
    const selectOptionRender = (options: Array<CustomSelectOption>) => {
      return (
        <>
          {options.map((item, key) => {
            return (
              <Option key={key} value={item.value}>
                {item.text}
              </Option>
            )
          })}
        </>
      )
    }
    return (
      <Form.Item {...customFormItem.customformItemPros}>
        <Select allowClear placeholder={customFormItem.placeholder} onChange={customFormItem.onChange}>
          {selectOptionRender(customFormItem.options)}
        </Select>
      </Form.Item>
    )
  }

  return (
    <Col span={customFormItem.col}>
      {customFormItem.valueType === 'Input' ? InputRender(customFormItem) : <></>}
      {customFormItem.valueType === 'Select' ? selectRender(customFormItem) : <></>}
    </Col>
  )
}
