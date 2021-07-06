import { FormItemProps } from 'antd/lib/form'
export namespace ComponentCustomFormIF {
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

  export type CustomerFormColumns = ReadonlyArray<CustomFormItem>

  export interface CustomFormProps {
    columns: CustomerFormColumns
    isEdit?: boolean
  }
}
