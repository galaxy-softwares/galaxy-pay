import { Button, Modal } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useAppState } from '../stores'
import { setVisible } from '../stores/app.store'

interface ModalFormProps {
  onCreate: () => void
  onClose: () => void
  title: string
}

export const ModalFrom: React.FC<ModalFormProps> = ({ onCreate, onClose, title, children }) => {
  const { visible } = useAppState(state => state.appsotre)
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
