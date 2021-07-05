import React, { FC, useCallback, useEffect, useState } from 'react'
import './index.less'
import { Tag } from 'antd'
import { WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons'
import { CardTable } from '../../components/CardTable/cardTable'
import { getTradeList } from '../../request/trade'

export const TradePage: FC = () => {
  const [taradeList, setTradeList] = useState([])

  const initTradeList = useCallback(async () => {
    const { data } = await getTradeList()
    setTradeList(data.data)
  }, [])

  useEffect(() => {
    initTradeList()
  }, [initTradeList])

  const columns = [
    {
      title: '账单号',
      dataIndex: 'sys_trade_no',
      key: 'out_trade_no'
    },
    {
      title: '支付流水号',
      dataIndex: 'sys_transaction_no',
      key: 'sys_transaction_no'
    },
    {
      title: '项目名称',
      dataIndex: 'payapp',
      key: 'payapp',
      render: (payapp: any) => <Tag color="#108ee9">{payapp.name}</Tag>
    },
    {
      title: '支付金额',
      dataIndex: 'trade_amount',
      key: 'trade_amount',
      render: (text: number) => {
        return `${text}`
      }
    },
    {
      title: '支付状态',
      dataIndex: 'trade_status',
      key: 'trade_status',
      render: (text: string) => {
        return text === '1' ? <Tag color="#87d068">已完成</Tag> : <Tag color="#108ee9">未完成</Tag>
      }
    },
    {
      title: '通道',
      dataIndex: 'trade_channel',
      key: 'trade_channel',
      render: (text: string) => {
        return text === 'wechat' ? (
          <Tag icon={<WechatOutlined />} color="#87d068">
            微信
          </Tag>
        ) : (
          <Tag icon={<AlipayCircleOutlined />} color="#2db7f5">
            支付宝
          </Tag>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 100
    }
  ]

  return (
    <div>
      <CardTable columns={columns} data={taradeList} title="支付账单" />
    </div>
  )
}
