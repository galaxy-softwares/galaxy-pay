import React from 'react'
import { Button, Modal } from 'antd'
import './formMdel.less'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../stores/app.store'
import { useAppState } from '../../stores'

interface IProps {
  title: string
  onCreate: () => void
  onCancel: () => void
}

export const FormModal: React.FC<IProps> = ({ title, onCreate, onCancel, children }) => {
  const { visible } = useAppState(state => state.appsotre)
  const dispatch = useDispatch()
  const colse = () => {
    dispatch(setVisible(false))
    onCancel()
  }
  return (
    <Modal
      forceRender={true}
      visible={visible}
      maskClosable={false}
      destroyOnClose={true}
      getContainer={false}
      width={500}
      footer={null}
      onCancel={colse}
    >
      <div className="title">{title}</div>
      {children}
      <Button type="primary" block className="space-16" onClick={onCreate}>
        提交
      </Button>
    </Modal>
  )
}
