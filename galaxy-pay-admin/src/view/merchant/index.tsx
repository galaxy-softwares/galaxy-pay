import React, { FC, useEffect, useState, useCallback } from 'react'
import { Table, notification, Card } from 'antd'
import './index.less'
import { Form, Tag } from 'antd'
import { merchantGetList, merchantCreateInfo, merchantDelete } from '../../request/merchant'
import { MerchantForm } from '../../components/merchantForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../state/actions/modal.action'
import { useHistory } from 'react-router-dom'
import { setMenu } from '../../state/actions/menu.actions'
import { FormModal } from '../../components/FormModel/formModel'

const Merchant: FC = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([
    {
      id: 1,
      name: '测试',
      channel: 'wechat',
      create_at: '测试'
    }
  ])
  const history = useHistory()
  const dispatch = useDispatch()
  const initMerchant = useCallback(async () => {
    // const result = await merchantGetList()
    // setData(result.data)
  }, [])

  useEffect(() => {
    initMerchant()
  }, [initMerchant])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '支付通道',
      dataIndex: 'channel',
      key: 'channel',
      render: (text: string) => {
        return text === 'wechat' ? <Tag color="#87d068">微信</Tag> : <Tag color="#108ee9">支付宝</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <>
          {/* <div
            onClick={() => {
              history.push(`/merchant/${record.id}`)
              dispatch(setMenu({ menuIndex: 0, title: '商户详情', path: '/detail' }))
            }}
          >
            详情
          </div>
          <div onClick={() => deleteMerchant(record.id)}>删除</div> */}
        </>
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
        <div className="table-card-comp-wrapper">
          <div className="table-card-container">
            <Table
              columns={columns}
              dataSource={data}
              rowKey={(record, index) => index}
              pagination={{
                hideOnSinglePage: true
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Merchant
