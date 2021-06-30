import { Row } from 'antd'
import { FormItemProps } from 'antd/lib/form'
import React, { FC } from 'react'
import { CustomFormItem } from './customFormItem'
export interface CustomFormItemIF {
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

export type Columns = Array<CustomFormItemIF>

interface CustomFormProps {
  columns: Columns
  isEdit?: boolean
}

export const CustomForm: FC<CustomFormProps> = ({ columns, isEdit }) => {
  return (
    <>
      <Row gutter={[16, 0]}>
        {columns.map((item, index) => {
          return <CustomFormItem isEdit={isEdit} customFormItem={item} key={index}></CustomFormItem>
        })}
      </Row>
    </>
  )
}

export interface CustomFormItemIFT {}
