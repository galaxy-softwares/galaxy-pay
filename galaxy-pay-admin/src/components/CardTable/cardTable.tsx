import { Button, Card, Input, Space, Table, Popover, Form, Select } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import React from 'react'
import './cardTable.less'

const { Option } = Select
export const CardTable: React.FC<any> = ({ columns, data, title }) => {
  const formPopover = () => {
    return (
      <div className="card__table_form__popover">
        <Form preserve={false} layout="vertical">
          <Form.Item name="software" label="归属项目">
            <Select placeholder="请选择归属项目" allowClear>
              <Option value="1">百筐易购</Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="支付应用通道">
            <Select placeholder="请选择应用类型" allowClear>
              <Option value="alipay">支付宝</Option>
              <Option value="wechat">微信</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    )
  }
  return (
    <Card className="card__table">
      <div className="card__table_head">
        <div className="card__table_head_title">
          <div>{title}</div>
        </div>
        <div className="card__table_head_search">
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="请输入内容" style={{ width: 200 }} />
            <Popover placement="bottom" content={formPopover} trigger="click">
              <Button type="primary" icon={<FilterOutlined />}></Button>
            </Popover>
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
