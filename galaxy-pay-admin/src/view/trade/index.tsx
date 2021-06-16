import React, { FC, useState } from 'react'
import './index.less'
import { Card, Table, Tag } from 'antd'
import { WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons'

const Trade: FC = () => {
  const [data, setData] = useState([])

  const columns = [
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 150
    },
    {
      title: '账单号',
      dataIndex: 'sys_trade_no',
      key: 'out_trade_no',
      width: 150
    },
    {
      title: '支付流水号',
      dataIndex: 'sys_transaction_no',
      key: 'sys_transaction_no',
      width: 150
    },
    {
      title: '项目名称',
      dataIndex: 'software',
      key: 'software',
      render: (software: any) => <Tag color="#108ee9">{software.name}</Tag>
    },
    {
      title: 'appid',
      dataIndex: 'appid',
      key: 'appid'
    },
    {
      title: '金额',
      dataIndex: 'trade_amount',
      key: 'trade_amount',
      render: text => {
        return `${text}`
      }
    },
    {
      title: '状态',
      dataIndex: 'trade_status',
      key: 'trade_status',
      render: (text: string) => {
        return text === '1' ? <Tag color="#87d068">已完成</Tag> : <Tag color="#108ee9">未完成</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'trade_type',
      key: 'trade_type',
      render: (text: string) => {
        const trade_type = ['支付', '退款', '打款']
        return <Tag color="purple">{trade_type[text]}</Tag>
      }
    },
    {
      title: '备注',
      dataIndex: 'trade_body',
      key: 'trade_body'
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
    }
  ]

  return (
    <div>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          pagination={{
            hideOnSinglePage: false,
            defaultPageSize: 7
          }}
          footer={() => '共 3 个条目'}
        />
      </Card>
    </div>
  )
}
export default Trade
