import { Row } from 'antd'

import React, { FC } from 'react'
import { ComponentCustomFormIF } from '../../interface/components.interface'
import { CustomFormItemRender } from './customFormItem'

export const CustomForm: FC<ComponentCustomFormIF.CustomFormProps> = ({ columns, isEdit, children }) => {
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
