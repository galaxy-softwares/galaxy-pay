import { Tag } from 'antd'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { CardTable } from '../../components/CardTable/cardTable'
import { ColumnsType } from 'antd/lib/table'
import { getRefundList } from '../../request/refund'
import moment from 'moment'

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
  const [refundList, setRefundList] = useState([])
  const [refundParams] = useState({})

  const initTradeList = useCallback(async () => {
    const { data } = await getRefundList(refundParams)
    setRefundList(data.data)
  }, [refundParams])

  useEffect(() => {
    initTradeList()
  }, [initTradeList])

  const columns: ColumnsType<dataType> = [
    {
      title: '退款账单号',
      dataIndex: 'sys_refund_no',
      key: 'sys_refund_no'
    },
    {
      title: '退款内部交易号',
      dataIndex: 'sys_transaction_no',
      key: 'sys_transaction_no'
    },
    {
      title: '项目名称',
      dataIndex: 'payapp',
      key: 'payapp',
      render: (payapp: any) => <span className="small_desc">{payapp.name}</span>
    },
    {
      title: '退款状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value: string) => (
        <Tag color={value === '1' ? '#87d068' : '#f50'}>{value === '1' ? '完成' : '未完成'}</Tag>
      )
    },
    {
      title: '支付通道',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
      render: (value: string) => (
        <Tag color={value === 'wechat' ? '#87d068' : '#2db7f5'}>{value === 'wechat' ? '微信' : '支付宝'}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 200,
      align: 'center',
      render: value => <span>{moment(value).format('YYYY-MM-DD HH:mm:DD')}</span>
    }
  ]

  return (
    <div>
      <CardTable columns={columns} data={refundList} title="" />
    </div>
  )
}
