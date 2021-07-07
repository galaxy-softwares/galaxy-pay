import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, message, Popconfirm, Space, Tag } from 'antd'
import { PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { CardTable } from '../../components/CardTable/cardTable'
import { Link, useHistory } from 'react-router-dom'
import { deletePayapp, getPayapps } from '../../request/payapp'
import { useCopyToClipboard } from 'react-use'
import { payappParamsForm } from './payAppCustomerForm'
import { FormPopoverContent } from '../../components/FormPopover/formPopover'
import { BaseIF } from '../../interface/base.interface'
import { PayappIF } from '../../interface/payapp.interface'

export const PayAppPage: FC = () => {
  const [payAppList, setPayAppList] = useState<PayappIF.PayappList>([])
  const history = useHistory()
  const [payappParams, setPayappParams] = useState<PayappIF.PayappParams>({ name: '', channel: '' })
  const [, copyPayAppId] = useCopyToClipboard()

  const initPayappData = useCallback(async () => {
    const { data } = await getPayapps(payappParams)
    setPayAppList(data)
  }, [payappParams])

  useEffect(() => {
    initPayappData()
  }, [initPayappData])

  const copyString = (name: string, value: string) => {
    copyPayAppId(value)
    message.success(`已复制 ${name} 到剪切板`)
  }

  const delPayapp = async (pay_app_id: string) => {
    const { status, data } = await deletePayapp(pay_app_id)
    if (status == 200) {
      message.success(data.message)
      initPayappData()
    }
  }

  const columns: ColumnsType<Required<PayappIF.Payapp>> = [
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
      render: (value: number, record: PayappIF.Payapp) => (
        <div>
          {value}
          <span className="small_desc">{record.software_name}</span>
        </div>
      )
    },
    {
      title: 'pay_app_id',
      dataIndex: 'pay_app_id',
      key: 'pay_app_id',
      width: 200,
      render: (value: string) => (
        <span onClick={() => copyString('pay_app_id', value)}>
          {value}
          <CopyOutlined />
        </span>
      )
    },
    {
      title: '密钥',
      dataIndex: 'pay_secret_key',
      key: 'pay_secret_key',
      width: 200,
      render: (value: string) => (
        <span onClick={() => copyString('秘钥', value)}>
          {value}
          <CopyOutlined />
        </span>
      )
    },
    {
      title: '支付通道',
      dataIndex: 'channel',
      key: 'channel',
      width: 120,
      align: 'center',
      render: (value: string) => (
        <Tag color={value === BaseIF.Channel.wechat ? '#87d068' : '#2db7f5'}>
          {value === BaseIF.Channel.wechat ? '微信' : '支付宝'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (value, record: PayappIF.Payapp) => (
        <Space>
          <Link to={`/payapps/modify/${record.id}`}>修改</Link>
          <Popconfirm
            title="确定要删除该支付应用么?"
            onConfirm={() => delPayapp(record.pay_app_id)}
            onCancel={() => {
              console.log(1)
            }}
            okText="删除"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
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
      <CardTable
        filter={true}
        formContent={
          <FormPopoverContent
            columns={payappParamsForm}
            callback={value => {
              setPayappParams({
                name: value.name,
                channel: value.channel
              })
            }}
          />
        }
        columns={columns}
        data={payAppList}
        title=""
      />
    </div>
  )
}
