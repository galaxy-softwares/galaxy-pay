import { Button, Card, Input, Space, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import './cardTable.less'
export const CardTable: React.FC<any> = ({ columns, data, title }) => {
  return (
    <Card className="card__table">
      <div className="card__table_head">
        <div className="card__table_head_title">{title}</div>
        <div className="card__table_head_search">
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="请输入内容" style={{ width: 200 }} />
            <Button type="primary">查询</Button>
          </Space>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => index}
        pagination={{
          hideOnSinglePage: false,
          pageSize: 8
        }}
      />
      <div className="_2005">123</div>
    </Card>
  )
}
