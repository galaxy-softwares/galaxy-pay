import React from 'react'
import { Button, Modal } from 'antd'
import './formMdel.less'
import { useDispatch, useSelector } from 'react-redux'
import { setVisible } from '../../state/actions/modal.action'
import { AppState } from '../../state/store'
interface IProps {
  title: string
  onCreate: () => void
  onCancel: () => void
}

export const FormModal: React.FC<IProps> = ({ title, onCreate, onCancel, children }) => {
  const { visible } = useSelector((state: AppState) => state.modalReducer)
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
