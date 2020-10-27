import React, { FC, useRef } from 'react'
import { uploadFile } from '../request/user'

interface UploadFileProps {
  accept: string
  uploadSuccess: (data) => void
  uploadFail: (data) => void
}

export const UploadFile: FC<UploadFileProps> = ({ accept, uploadSuccess, uploadFail = null, children }) => {
  const uploadRef = useRef(null)

  const handleUpload = event => {
    uploadFile(event.target.files[0]).then((res: any) => {
      if (res) {
        return uploadSuccess(res.data)
      } else {
        return uploadFail(res.message)
      }
    })
  }

  const handleClick = () => {
    uploadRef.current.click()
  }

  return (
    <div onClick={handleClick}>
      {children}
      <input onChange={handleUpload} ref={uploadRef} type="file" multiple accept={accept} style={{ display: 'none' }} />
    </div>
  )
}
