import { Button, Modal } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../state/store'
import { setVisible } from '../state/actions/modal.action'

interface ModalFormProps {
  onCreate: () => void
  onClose: () => void
  title: string
}

export const ModalFrom: React.FC<ModalFormProps> = ({ onCreate, onClose, title, children }) => {
  const { visible } = useSelector((state: AppState) => state.modalReducer)
  const dispatch = useDispatch()
  const colse = () => {
    dispatch(setVisible(false))
    onClose()
  }

  return (
    <>
      <Modal
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}
        getContainer={false}
        width={640}
        visible={visible}
        title={title}
        onCancel={() => {
          colse()
        }}
        footer={[
          <Button key="submit" type="primary" onClick={() => onCreate()}>
            提 交
          </Button>
        ]}
      >
        {children}
      </Modal>
    </>
  )
}
