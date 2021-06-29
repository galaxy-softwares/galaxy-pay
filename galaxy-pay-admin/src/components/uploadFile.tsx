import { message, Upload } from 'antd'
import React, { FC } from 'react'
interface UploadFileProps {
  accept?: string
  name: string
  uploadSuccess: (data) => void
  // uploadFail: (data) => void
}

export const UploadFile: FC<UploadFileProps> = ({ name, accept = '.crt', uploadSuccess, children }) => {
  const props: any = {
    name: 'file',
    action: 'http://127.0.0.1:3200/file/uploadFile',
    headers: {
      authorization: 'authorization-text'
    },
    accept: accept,
    showUploadList: false,
    data: {
      fileName: name
    },
    onChange(info) {
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
