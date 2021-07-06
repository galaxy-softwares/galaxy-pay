import React, { FC, useCallback, useEffect, useState } from 'react'
import './index.less'
import { Tag } from 'antd'
import { WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons'
import { CardTable } from '../../components/CardTable/cardTable'
import { getTradeList } from '../../request/trade'
import moment from 'moment'
import { FormPopoverContent } from '../../components/FormPopover/formPopover'
import { tradeParamsForm } from '../refund/refundPage'

export const TradePage: FC = () => {
  const [taradeList, setTradeList] = useState([])
  const [tradeParams, setTradeParams] = useState({
    sys_trade_no: '',
    channel: ''
  })

  const initTradeList = useCallback(async () => {
    const { data } = await getTradeList(tradeParams)
    setTradeList(data)
  }, [tradeParams])

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
      dataIndex: 'pay_app_name',
      key: 'pay_app_name',
      render: (value: string, record: any) => (
        <div>
          {value}
          <span className="small_desc">{record.software_name}</span>
        </div>
      )
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
        return text === '1' ? <Tag color="#87d068">已支付</Tag> : <Tag color="#f50">未支付</Tag>
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
      render: (value: string) => <span>{moment(value).format('YYYY-MM-DD HH:mm:DD')}</span>
    }
  ]

  return (
    <div>
      <div className="page__title_warp">
        <div className="title">支付账单</div>
        <div className="create"></div>
      </div>
      <CardTable
        filter={true}
        formContent={
          <FormPopoverContent
            columns={tradeParamsForm}
            callback={value => {
              console.log(value, 'value')
              setTradeParams({
                sys_trade_no: value.sys_trade_no ? value.sys_trade_no : '',
                channel: value.channel ? value.channel : ''
              })
            }}
          />
        }
        columns={columns}
        data={taradeList}
        title=""
      />
    </div>
  )
}
