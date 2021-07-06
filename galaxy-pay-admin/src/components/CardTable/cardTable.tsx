import { Button, Card, Table, Popover } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import React from 'react'
import './cardTable.less'
import { ColumnsType } from 'antd/lib/table'

interface CardTableProps {
  columns: ColumnsType
  data: Array<any>
  title: string
  filter?: boolean
  formContent?: JSX.Element
  onSearch?: () => void
}
export const CardTable: React.FC<CardTableProps> = ({ columns, data, title, filter, formContent }) => {
  const formPopover = () => {
    return <div className="card__table_form__popover">{formContent}</div>
  }
  return (
    <Card className="card__table">
      {filter ? (
        <>
          <div className="card__table_head">
            <div className="card__table_head_title">
              <div>{title}</div>
            </div>
            <div className="card__table_head_search">
              {formContent ? (
                <>
                  <Popover placement="bottom" content={formPopover} trigger="click">
                    <Button type="primary" icon={<FilterOutlined />}></Button>
                  </Popover>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => index}
        pagination={{
          hideOnSinglePage: false,
          pageSize: 8
        }}
      />
      <div className="_2005"></div>
    </Card>
  )
}
