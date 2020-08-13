import React, { useEffect, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    AppstoreOutlined,
    GoldOutlined,
    SettingOutlined,
    CopyOutlined
  } from '@ant-design/icons';
import { Layout } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AppState } from "../state/store";
import { setMenu } from '../state/actions/menu.actions';
const { Sider } = Layout;

const menuList = [
    {
        title: '项目管理',
        icon: <AppstoreOutlined />,
        path: '/'
    },
    {
        title: '订单列表',
        icon: <CopyOutlined />,
        path: '/order'
    }
]

const LeftSider: FC = () => {
    const { menuIndex } = useSelector((state: AppState) => state.menuReducer)
    const history = useHistory()
    const location = useLocation();
    const dispatch = useDispatch()

    history.listen( (location) => {
        setMenuInfo(location)
    })

    const setMenuInfo = (location) => {
        // eslint-disable-next-line array-callback-return
        menuList.map((item,index) => {
            if (item.path === location.pathname) {
                dispatch(setMenu({ menuIndex: index, title: item.title, path: location.pathname }))
            }
        })
    }

    useEffect( () => {
        setMenuInfo(location)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, ["menuState"])

    return (
        <Sider width={190} className="slider" >
            <div className="App-logo">
            支付平台
            </div>
            <div id="menu-list">
            {
                menuList.map( (item, index) => {
                    return (
                        <div key={index}>
                            <Link to={item.path}>
                                <div className={`list-item ${ menuIndex === index ? 'active' : ''}`}>
                                    {item.icon}
                                    <p>{item.title}</p>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
            </div>
          </Sider>
    )
}

export default LeftSider

