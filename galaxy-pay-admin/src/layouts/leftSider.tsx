import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppstoreOutlined, CopyOutlined, AppstoreAddOutlined, DashboardOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { useAppState } from '../stores'
import { setMenu, setMenuBreadcrumb } from '../stores/app.store'

const { Sider } = Layout

const menuList = [
  {
    title: '首页',
    icon: <DashboardOutlined />,
    path: '/'
  },
  {
    title: '项目管理',
    icon: <AppstoreOutlined />,
    path: '/softwares'
  },
  {
    title: '支付应用',
    icon: <AppstoreAddOutlined />,
    path: '/payapps'
  },
  {
    title: '支付账单',
    icon: <CopyOutlined />,
    path: '/trades'
  },
  {
    title: '打款账单',
    icon: <CopyOutlined />,
    path: '/payments'
  }
]

const LeftSider: FC = () => {
  const { activeMenu } = useAppState(state => state.appsotre)
  const history = useHistory()
  const dispatch = useDispatch()

  history.listen(location => {
    setMenuInfo(location)
  })

  const setMenuInfo = location => {
    menuList.map((item, index) => {
      if (item.path === location.pathname) {
        dispatch(setMenu({ menuIndex: index, path: location.pathname }))
      }
    })
    dispatch(setMenuBreadcrumb(location.pathname.split('/').filter(i => i)))
  }

  useEffect(() => {
    setMenuInfo(history.location)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Sider width={190} className="slider">
      <div className="app__logo">logo</div>
      <div id="menu__list">
        {menuList.map((item, index) => {
          return (
            <div key={index}>
              <Link to={item.path}>
                <div className={`list-item ${activeMenu.menuIndex === index ? 'active' : ''}`}>
                  {item.icon}
                  <p>{item.title}</p>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </Sider>
  )
}

export default LeftSider
