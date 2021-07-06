import { Tag } from 'antd'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { CardTable } from '../../components/CardTable/cardTable'
import { ColumnsType } from 'antd/lib/table'
import { getRefundList } from '../../request/refund'
import moment from 'moment'
import { FormPopoverContent } from '../../components/FormPopover/formPopover'
import { ComponentCustomFormIF } from '../../interface/components.interface'

type dataType = {
  id: number
  name: string
  amount: number
  order: number
  paid: number
  software: string
  create_at: string
}

export const tradeParamsForm: ComponentCustomFormIF.CustomerFormColumns = [
  {
    label: '账单号',
    valueType: 'Input',
    placeholder: '请输入账单号',
    col: 24,
    customformItemPros: {
      name: 'sys_trade_no',
      prefixCls: ''
    }
  },
  {
    label: '支付通道',
    valueType: 'Select',
    editDisable: true,
    placeholder: '请选择归属项目',
    col: 24,
    options: [
      {
        value: 'wechat',
        text: '微信支付'
      },
      {
        value: 'alipay',
        text: '支付宝'
      }
    ],
    customformItemPros: {
      name: 'channel'
    }
  }
]

export const RefundPage: FC = () => {
  const [refundList, setRefundList] = useState([])
  const [refundParams, setRefundParams] = useState({
    sys_trade_no: '',
    channel: ''
  })

  const initTradeList = useCallback(async () => {
    const { data } = await getRefundList(refundParams)
    setRefundList(data)
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
      <div className="page__title_warp">
        <div className="title">退款账单</div>
        <div className="create"></div>
      </div>
      <CardTable
        filter={true}
        formContent={
          <FormPopoverContent
            columns={tradeParamsForm}
            callback={value => {
              setRefundParams({
                sys_trade_no: value.sys_trade_no,
                channel: value.channel
              })
            }}
          />
        }
        columns={columns}
        data={refundList}
        title=""
      />
    </div>
  )
}
