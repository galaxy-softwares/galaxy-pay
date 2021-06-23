import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, Tag } from 'antd'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { CardTable } from '../../components/CardTable/cardTable'
import { useHistory } from 'react-router-dom'
import { getPayapp } from '../../request/payapp'

type dataType = {
  id: number
  name: string
  amount: number
  order: number
  paid: number
  software: string
  create_at: string
}

export const PayAppPage: FC = () => {
  const [payAppList, setPayAppList] = useState()
  const history = useHistory()

  const initPayappData = useCallback(async () => {
    const result = await getPayapp()
    console.log(result.data, 'result')
    setPayAppList(result.data)
  }, [])

  useEffect(() => {
    initPayappData()
  }, [initPayappData])

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
      render: (value: number, record: any) => (
        <div>
          {value}
          <span className="small_desc ">{record.software?.name}</span>
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
      title: 'payapp_type',
      dataIndex: 'payapp_type',
      key: 'payapp_type'
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'left',
      width: 200,
      sorter: {
        compare: (a, b) => a.amount - b.amount
      },
      render: (record: number) => <div className="table-font table_amount">{record}</div>
    },
    {
      title: '支付笔数',
      dataIndex: 'paid',
      key: 'paid',
      width: 200,
      sorter: {
        compare: (a, b) => a.paid - b.paid
      },
      render: (record: number) => <div className="table-font">{record}</div>
    },
    {
      title: '支付应用通道',
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
      width: 140
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
      render: () => (
        <div className="table_action">
          <EllipsisOutlined />
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="page__title_warp">
        <div className="title">支付应用</div>
        <div className="create">
          <Button
            type="primary"
            onClick={() => {
              history.push('/payapps/modify')
            }}
            icon={<PlusOutlined />}
          >
            创建应用
          </Button>
        </div>
      </div>
      <CardTable columns={columns} data={payAppList} title="" />
    </div>
  )
}
