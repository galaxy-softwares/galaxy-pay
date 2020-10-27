import React, { FC } from 'react'
import './index.less'
import { Button, Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../state/store'
import { setVisible } from '../state/actions/modal.action'
const { Header } = Layout

const RenderAction = () => {
  const { path } = useSelector((state: AppState) => state.menuReducer)
  const dispatch = useDispatch()
  const handleOpenSoftwareCreate = () => {
    dispatch(setVisible(true))
  }

  return (
    <>
      {path === '/' ? (
        <Button type="primary" onClick={() => handleOpenSoftwareCreate()}>
          创建项目
        </Button>
      ) : (
        <></>
      )}
    </>
  )
}

const Headers: FC = () => {
  const { title } = useSelector((state: AppState) => state.menuReducer)

  return (
    <Header>
      <div className="flex-grow-1">
        <strong>{title}</strong>
      </div>
      <div className="flex-grow-0 flex-align-items-center">
        <RenderAction />
      </div>
    </Header>
  )
}

export default Headers
