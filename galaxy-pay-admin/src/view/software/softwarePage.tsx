import { Avatar, Button, Form, message, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { FC, useEffect, useState, useCallback } from 'react'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import { CardTable } from '../../components/CardTable/cardTable'
import { FormModal } from '../../components/FormModel/formModel'
import { SoftwareForm } from '../../components/softwareForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../stores/app.store'
import {} from 'react'
import { createSoftware, getSoftwares } from '../../request/software'
type dataType = {
  id: number
  name: string
  create_at: string
}

export const SoftwarePage: FC = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const handleOpenModal = () => {
    dispatch(setVisible(true))
  }
  const [data, setData] = useState()

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    setData(data)
  }, [])

  useEffect(() => {
    initSoftwareList()
  }, [initSoftwareList])

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
      title: 'return_url',
      dataIndex: 'return_url',
      key: 'return_url',
      align: 'center'
    },
    {
      title: 'callback_url',
      dataIndex: 'callback_url',
      key: 'callback_url',
      align: 'center'
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

  const create = async form => {
    const res = await createSoftware(form)
    if (res.status == 201) {
      message.success('创建成功！')
      dispatch(setVisible(false))
    }
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
        <SoftwareForm form={form} />
      </FormModal>
      <div className="page__title_warp">
        <div className="title">项目管理</div>
        <div className="create">
          <Button type="primary" onClick={handleOpenModal} icon={<PlusOutlined />}>
            创建项目
          </Button>
        </div>
      </div>
      <CardTable columns={columns} data={data} title="" />
    </div>
  )
}
