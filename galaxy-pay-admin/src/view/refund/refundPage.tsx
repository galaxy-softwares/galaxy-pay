import { Space, Tag } from 'antd'

import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { CardTable } from '../../components/CardTable/cardTable'
import { ColumnsType } from 'antd/lib/table'

type dataType = {
  id: number
  name: string
  amount: number
  order: number
  paid: number
  software: string
  create_at: string
}

export const RefundPage: FC = () => {
  const columns: ColumnsType<dataType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      sorter: {
        compare: (a, b) => a.id - b.id
      }
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (value: number, record: any) => (
        <div>
          {value}
          <span className="small_desc">{record.software?.name}</span>
        </div>
      )
    },
    {
      title: 'pay_app_id',
      dataIndex: 'pay_app_id',
      key: 'pay_app_id',
      width: 200
    },
    {
      title: '密钥',
      dataIndex: 'pay_secret_key',
      key: 'pay_secret_key',
      width: 200
    },
    {
      title: '支付通道',
      dataIndex: 'channel',
      key: 'channel',
      width: 120,
      align: 'center',
      render: (value: string) => (
        <Tag color={value === 'wechat' ? '#87d068' : '#2db7f5'}>{value === 'wechat' ? '微信' : '支付宝'}</Tag>
      )
    },
    {
      title: '创建于',
      dataIndex: 'create_at',
      key: 'create_at',
      align: 'center',
      width: 200
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (value, record) => (
        <Space>
          <Link to={`/payapps/modify/${record.id}`}>修改</Link>
          <Link to="">删除</Link>
        </Space>
      )
    }
  ]

  return (
    <div>
      <CardTable columns={columns} data={[]} title="" />
    </div>
  )
}
