import React, { FC, useEffect, useState, useCallback } from 'react'
import { Button, Form, message, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined } from '@ant-design/icons'
import { CardTable } from '../../components/CardTable/cardTable'
import { FormModal } from '../../components/FormModel/formModel'
import { SoftwareForm } from '../../components/softwareForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../stores/app.store'
import { createSoftware, getSoftwares } from '../../request/software'
import moment from 'moment'
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
  const [softwareList, setSoftwareList] = useState()

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    setSoftwareList(data)
  }, [])

  useEffect(() => {
    initSoftwareList()
  }, [initSoftwareList])

  const columns: ColumnsType<dataType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (record: number) => <Space size={10}>{record}</Space>
    },
    {
      title: '创建于',
      dataIndex: 'create_at',
      key: 'create_at',
      align: 'center',
      render: (value: string) => <span>{moment(value).format('YYYY-MM-DD HH:mm:DD')}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: () => <Space>删除</Space>
    }
  ]

  const create = async value => {
    const res = await createSoftware(value)
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
      <CardTable columns={columns} data={softwareList} title="" />
    </div>
  )
}
