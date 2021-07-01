import { Row } from 'antd'
import { FormItemProps } from 'antd/lib/form'
import React, { FC } from 'react'
import { CustomFormItemRender } from './customFormItem'
export interface CustomFormItem {
  label: string
  valueType: string
  col: number
  placeholder: string
  editDisable?: boolean
  onChange?: (...value: any) => void
  options?: Array<CustomSelectOption>
  customformItemPros: FormItemProps
}

export interface CustomSelectOption {
  value: string | number
  text: string
}

export type CustomerFormColumns = Array<CustomFormItem>

interface CustomFormProps {
  columns: CustomerFormColumns
  isEdit?: boolean
}

export const CustomForm: FC<CustomFormProps> = ({ columns, isEdit, children }) => {
  return (
    <>
      <Row gutter={[16, 0]}>
        {columns.map((item, index) => {
          return <CustomFormItemRender isEdit={isEdit} customFormItem={item} key={index}></CustomFormItemRender>
        })}
        {children}
      </Row>
    </>
  )
}
