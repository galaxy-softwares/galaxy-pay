import React, { FC } from 'react'
import './index.less'
import { Avatar, Breadcrumb, Layout } from 'antd'
import { Link } from 'react-router-dom'
import { useAppState } from '../stores'
const { Header } = Layout
const breadcrumbNameMap = {
  softwares: '项目管理',
  apppay: '支付应用',
  trade: '支付账单',
  modify: '支付应用操作'
}
const Headers: FC = () => {
  const { menuBreadcrumb } = useAppState(state => state.appsotre)

  return (
    <Header>
      <div className="flex-grow-1 header__breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          {menuBreadcrumb.length > 0 ? (
            menuBreadcrumb.map((item, key) => {
              return (
                <Breadcrumb.Item key={key}>
                  <Link to={`/${item}`}> {breadcrumbNameMap[item]}</Link>
                </Breadcrumb.Item>
              )
            })
          ) : (
            <></>
          )}
        </Breadcrumb>
      </div>
      <div className="flex-grow-0 flex-align-items-center">
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </div>
    </Header>
  )
}

export default Headers
