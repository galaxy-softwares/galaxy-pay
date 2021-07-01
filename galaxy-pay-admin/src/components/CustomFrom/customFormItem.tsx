import React, { FC } from 'react'
import { Col, Form, Input, Select } from 'antd'
import { CustomFormItem, CustomSelectOption } from './customForm'
const { Option } = Select

interface FormItemProps {
  customFormItem: CustomFormItem
  isEdit?: boolean
}
export const CustomFormItemRender: FC<FormItemProps> = ({ customFormItem, isEdit }) => {
  const { label } = customFormItem
  customFormItem.customformItemPros.label = label

  function InputRender(customFormItem: CustomFormItem): JSX.Element {
    return (
      <Form.Item {...customFormItem.customformItemPros}>
        <Input
          disabled={isEdit == true ? customFormItem.editDisable : false}
          placeholder={customFormItem.placeholder}
        />
      </Form.Item>
    )
  }

  function selectRender(customFormItem: CustomFormItem): JSX.Element {
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
        <Select
          disabled={isEdit == true ? customFormItem.editDisable : false}
          allowClear
          placeholder={customFormItem.placeholder}
          onChange={customFormItem.onChange}
        >
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
