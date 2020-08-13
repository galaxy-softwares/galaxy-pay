import { Button, Modal  } from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../state/store";
import {setVisible} from "../state/actions/modal.action";

interface ModalFormProps {
  onCreate: () => void;
  title: string
}

export const ModalFrom: React.FC<ModalFormProps> = ({
  onCreate,
  title,
  children
}) => {
  const { visible } = useSelector((state: AppState) => state.modalReducer)
  const dispatch = useDispatch()
  const onColse = () => {
    dispatch(setVisible(false))

  }

  return (
    <>
      <Modal forceRender={true} maskClosable={false} destroyOnClose={true} getContainer={false}  width={640} visible={visible} title={title} onCancel={() => {
        onColse()
      }}
      footer={[
        <Button key="submit" type="primary" onClick={() => onCreate()}>
          提 交
        </Button>
      ]}>
        {children}
      </Modal>
    </>
  );
};
