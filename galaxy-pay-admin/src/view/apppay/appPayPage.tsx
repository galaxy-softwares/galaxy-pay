import React, { FC, useEffect, useState, useCallback } from 'react'
import { notification, Button, Tag } from 'antd'
import { Form } from 'antd'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import { merchantCreateInfo } from '../../request/merchant'
import { MerchantForm } from '../../components/merchantForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../state/actions/modal.action'
// import { setMenu } from '../../state/actions/menu.actions'
import { FormModal } from '../../components/FormModel/formModel'
import { ColumnsType } from 'antd/lib/table'
import { CardTable } from '../../components/CardTable/cardTable'

type dataType = {
  id: number
  name: string
  amount: number
  order: number
  paid: number
  software: string
  create_at: string
}

export const AppPayPage: FC = () => {
  const [form] = Form.useForm()

  const data = []
  for (let i = 1; i <= 20; i++) {
    console.log(11)
    data.push({
      id: i,
      name: '小程序支付',
      amount: 999123,
      order: 1000,
      paid: 999,
      channel: 'wechat',
      appid: 'FRZcaCHvpwDnBWVE',
      software: '百筐易购',
      create_at: '2021-06-16'
    })
  }

  // const history = useHistory()
  const dispatch = useDispatch()
  // const initMerchant = useCallback(async () => {
  //   const result = await merchantGetList()
  //   setData(result.data)
  // }, [])

  // useEffect(() => {
  // initMerchant()
  // }, [initMerchant])

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
      render: (value: number, record) => (
        <div>
          {value}
          <span className="small_desc ">{record.software}</span>
        </div>
      )
    },
    {
      title: 'APPID',
      dataIndex: 'appid',
      key: 'appid',
      width: 200
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
      render: (value: string) => <Tag color={value === 'wechat' ? '#87d068' : '#2db7f5'}>{value}</Tag>
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

  const openNotification = config => {
    notification.open(config)
  }

  // const deleteMerchant = async id => {
  //   const { status } = await merchantDelete(id)
  //   if (status === 201) {
  //     console.log('删除成功！')
  //   }
  //   merchantGetList().then((res: any) => {
  //     setData(res.data)
  //   })
  // }

  const create = async form => {
    const { status } = await merchantCreateInfo(form)
    if (status === 201) {
      openNotification({
        key: 'softwareCreate',
        type: 'success',
        message: `${form.name} 创建完成！`,
        duration: 3
      })
    }
    dispatch(setVisible(false))
    // merchantGetList().then((res: any) => {
    //   setData(res.data)
    // })
  }

  const handleOpenSoftwareCreate = () => {
    dispatch(setVisible(true))
  }

  return (
    <div>
      <FormModal
        title="项目创建"
        onCancel={() => {
          console.log('不知道为啥失败了！')
        }}
        onCreate={() => {
          form
            .validateFields()
            .then((values: any) => {
              create(values)
              form.resetFields()
            })
            .catch(info => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <MerchantForm form={form} />
      </FormModal>
      <div className="page__title_warp">
        <div className="title">支付应用</div>
        <div className="create">
          <Button type="primary" onClick={handleOpenSoftwareCreate} icon={<PlusOutlined />}>
            创建应用
          </Button>
        </div>
      </div>
      <CardTable columns={columns} data={data} title="" />
    </div>
  )
}
