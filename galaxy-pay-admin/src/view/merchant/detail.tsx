import React, { useState } from 'react'
import { FC } from 'react'
import { Table, Card } from 'antd'

const Detail: FC = () => {
  const [data] = useState([])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at'
    },
    {
      title: '操作',
      key: 'action'
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
            hideOnSinglePage: true
          }}
        />
      </Card>
    </div>
  )
}
export default Detail
