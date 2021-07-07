import { message, Upload } from 'antd'
import { UploadChangeParam, UploadProps } from 'antd/lib/upload'
import React, { FC } from 'react'
interface UploadFileProps {
  accept?: string
  name: string
  disabled?: boolean
  uploadSuccess: (data: { name: string; path: string }) => void
}

export const UploadFile: FC<UploadFileProps> = ({
  name,
  disabled = false,
  accept = '.crt',
  uploadSuccess,
  children
}) => {
  const props: UploadProps = {
    name: 'file',
    action: 'http://127.0.0.1:3200/file/uploadFile',
    accept: accept,
    showUploadList: false,
    disabled: disabled,
    data: {
      fileName: name,
      accept: accept
    },
    onChange(info: UploadChangeParam) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功！`)
        return uploadSuccess({ name, path: info.file.response.path })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败稍后再试！`)
      }
    }
  }

  return <Upload {...props}>{children}</Upload>
}
