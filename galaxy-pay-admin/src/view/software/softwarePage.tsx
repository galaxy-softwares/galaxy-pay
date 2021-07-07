import React, { FC, useEffect, useState, useCallback } from 'react'
import { Button, Form, message, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined } from '@ant-design/icons'
import { CardTable } from '../../components/CardTable/cardTable'
import { FormModal } from '../../components/FormModel/formModel'
import { SoftwareForm } from '../../components/softwareForm'
import { useDispatch } from 'react-redux'
import { setVisible } from '../../stores/app.store'
import { createSoftware, getSoftwares, deleteSoftware } from '../../request/software'
import moment from 'moment'
import { SoftwareIF } from '../../interface/software.interface'

export const SoftwarePage: FC = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const handleOpenModal = () => {
    dispatch(setVisible(true))
  }
  const [softwareList, setSoftwareList] = useState<SoftwareIF.SoftwareList>([])

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    setSoftwareList(data)
  }, [])

  useEffect(() => {
    initSoftwareList()
  }, [initSoftwareList])

  const editSoftware = (software: SoftwareIF.Software) => {
    form.setFieldsValue({
      id: software.id,
      name: software.name
    })
    dispatch(setVisible(true))
  }

  const delSoftware = async (id: number) => {
    const { status, data } = await deleteSoftware(id)
    if (status == 200) {
      message.success(data.message)
      initSoftwareList()
    }
  }

  const columns: ColumnsType<SoftwareIF.Software> = [
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
      render: (value: number) => <Space size={10}>{value}</Space>
    },
    {
      title: '创建于',
      dataIndex: 'create_at',
      key: 'create_at',
      align: 'center',
      width: 200,
      render: (value: string) => <span>{moment(value).format('YYYY-MM-DD HH:mm:DD')}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
      render: (value, record: Required<SoftwareIF.Software>) => (
        <Space>
          <a onClick={() => editSoftware(record)}>修改</a>
          <a onClick={() => delSoftware(record.id)}>删除</a>
        </Space>
      )
    }
  ]

  const create = async (value: SoftwareIF.Software) => {
    const res = await createSoftware(value)
    if (res.status == 201) {
      message.success('操作成功！')
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
            .then((values: SoftwareIF.Software) => {
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
