import React, { FC, useEffect, useState, useCallback } from 'react'
import { Table, notification, Card, Avatar, Space, Input } from 'antd'
import { Form } from 'antd'
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons'
import { merchantGetList, merchantCreateInfo, merchantDelete } from '../../request/merchant'
import { MerchantForm } from '../../components/merchantForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../state/actions/modal.action'
import { useHistory } from 'react-router-dom'
// import { setMenu } from '../../state/actions/menu.actions'
import { FormModal } from '../../components/FormModel/formModel'
import { ColumnsType } from 'antd/lib/table'

type dataType = {
  id: number
  name: string
  amount: number
  order: number
  paid: number
  unpaid: number
  software: number
  create_at: string
}

const Merchant: FC = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([
    {
      id: 1,
      name: '测试项目1',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 2,
      name: '测试项目2',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 3,
      name: '测试项目3',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 4,
      name: '测试项目4',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 5,
      name: '测试项目5',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 6,
      name: '测试项目6',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    },
    {
      id: 7,
      name: '测试项目7',
      amount: 999123,
      order: 1000,
      paid: 999,
      unpaid: 1,
      software: 10,
      create_at: '2021-06-16'
    }
  ])
  // const history = useHistory()
  const dispatch = useDispatch()
  const initMerchant = useCallback(async () => {
    // const result = await merchantGetList()
    // setData(result.data)
  }, [])

  useEffect(() => {
    initMerchant()
  }, [initMerchant])

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
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (record: number) => (
        <Space size={10}>
          <Avatar size={30} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
          {record}
        </Space>
      )
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
      title: '未支付笔数',
      dataIndex: 'unpaid',
      key: 'unpaid',
      width: 200,
      sorter: {
        compare: (a, b) => a.unpaid - b.unpaid
      },
      render: (record: number) => <div className="table-font table_unpaid">{record}</div>
    },
    {
      title: '创建于',
      dataIndex: 'create_at',
      key: 'create_at',
      align: 'center',
      width: 140,
      sorter: {
        compare: (a, b) => a.unpaid - b.unpaid
      }
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

  const deleteMerchant = async id => {
    const { status } = await merchantDelete(id)
    if (status === 201) {
      console.log('删除成功！')
    }
    merchantGetList().then((res: any) => {
      setData(res.data)
    })
  }

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
    merchantGetList().then((res: any) => {
      setData(res.data)
    })
  }

  return (
    <div>
      <FormModal
        title="项目创建"
        onCancel={() => {
          console.log('this is jb')
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

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          pagination={{
            hideOnSinglePage: true
          }}
          footer={() => '共 3 个条目'}
        />
      </Card>
    </div>
  )
}

export default Merchant
