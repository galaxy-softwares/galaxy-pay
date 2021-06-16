import React, { FC } from 'react'
import './index.less'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Layout } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../state/store'
import { setVisible } from '../state/actions/modal.action'
import { useHistory } from 'react-router-dom'
const { Header } = Layout

const RenderAction = () => {
  const { path } = useSelector((state: AppState) => state.menuReducer)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleOpenSoftwareCreate = () => {
    dispatch(setVisible(true))
  }

  return (
    <>
      {path === '/' ? (
        <Button type="primary" onClick={() => handleOpenSoftwareCreate()} icon={<PlusOutlined />}>
          创建商户
        </Button>
      ) : (
        <>
          <div className="margin-10">
            <Input placeholder="搜索" suffix={<SearchOutlined />} />
          </div>
        </>
      )}
      {path === '/detail' ? (
        <Button type="primary" onClick={() => history.go(-1)}>
          返回
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
      <div className="flex-grow-1 header_title">{title}</div>
      <div className="flex-grow-0 flex-align-items-center">
        <RenderAction />
      </div>
    </Header>
  )
}

export default Headers
