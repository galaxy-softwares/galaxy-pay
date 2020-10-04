import React, {FC, useState, useCallback, useEffect} from 'react';
import "./index.less";
import { Card, Col, Row, Table, Tag } from 'antd';
import {
    WechatOutlined,
    AlipayCircleOutlined
  } from '@ant-design/icons';
import { orderGetList } from '../../request/order';

const Order: FC = () => {
    const [data, setData]= useState([]);
    const [expenditure, setExpenditure] = useState({
        amount: Number,
        count: Number,
    });
    const [income, setIncome] = useState({
        amount: Number,
        count: Number,
    });

    const initOrder = useCallback( async () => {
        const result = await orderGetList();
        setData(result.data.data);
        setIncome(result.data.income);
        setExpenditure(result.data.expenditure);
    }, [data])

    useEffect( () => {
        initOrder();
    }, [])

    const tradeAccountType = {
        "0" : {
            text: '支付',
            color: '#13c2c2'
        },
        "1" : {
            text: '提现',
            color: '#722ed1'
        },
        '2': {
            text: '退款',
            color: '#f5222d'
        }
    }

    const columns = [
        {
            title: '创建时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 150,
        },
        {
            title: '账单号',
            dataIndex: 'out_trade_no',
            key: 'out_trade_no',
            width: 150,
        },
        {
            title: '支付流水号',
            dataIndex: 'trade_no',
            key: 'trade_no',
            width: 150,
        },
        {
            title: '项目名称',
            dataIndex: 'software',
            key: 'software',
            render: (software: any) => {
                return  <Tag color="#2f54eb">{software.name}</Tag>
            },
        },
        {
            title: 'appid',
            dataIndex: 'appid',
            key: 'appid'
        },
        {
            title: '金额',
            dataIndex: 'trade_amount',
            key: 'trade_amount',
            render: (text, record) => {
                return record.trade_type === '1' ? `-${text}`: `${text}`;
            }
        },
        {
            title: '收支',
            dataIndex: 'trade_type',
            key: 'trade_type',
            render: (text: string) => {
                return  text === '1' ? <Tag color="#eb2f96">支出</Tag> : <Tag color="#fa8c16">收入</Tag>;
            },
        },
        {
            title: '账单类型',
            dataIndex: 'trade_account_type',
            key: 'trade_account_type',
            render: (text: string) => {
                return  <Tag color={tradeAccountType[text].color}>{tradeAccountType[text].text}</Tag>;
            },
        },
        {
            title: '状态',
            dataIndex: 'trade_status',
            key: 'trade_status',
            render: (text: number) => {
                return text === 1 ? <Tag color="#87d068">已完成</Tag>: <Tag color="#108ee9">未完成</Tag>
            },
        },
        {
            title: '备注',
            dataIndex: 'trade_body',
            key: 'trade_body',
        },
        {
            title: '通道',
            dataIndex: 'trade_channel',
            key: 'trade_channel',
            render: (text: string) => {
            return text === 'wechat' ? <Tag icon={<WechatOutlined />} color="#87d068">微信</Tag>: <Tag icon={<AlipayCircleOutlined />} color="#2db7f5">支付宝</Tag>
            },
        },
    ];

    const Info: FC<{
        title: React.ReactNode;
        value: React.ReactNode;
        desc: React.ReactNode;
        bordered?: boolean;
      }> = ({ title, value, desc, bordered }) => (
        <div className='headerInfo'>
          <span>{title}</span>
          <p>{value}</p>
          <span className="desc">{desc}</span>
          {bordered && <em />}
        </div>
      );
      
    return (
        <div>
            <Card bordered={false} className="margin-20">
                <Row>
                <Col sm={6} xs={24}>
                    <Info title="收入" value={`${income.amount}￥`} desc={`共${income.count} 笔`} bordered />
                </Col>
                <Col sm={6} xs={24}>
                    <Info title="支出" value={`${expenditure.amount}￥`} desc={`共${expenditure.count} 笔`} bordered />
                </Col>
                <Col sm={6} xs={24}>
                    <Info title="" value="" desc=""/>
                </Col>
                </Row>
            </Card>
            <Card bordered={false}>
                <Table columns={columns} dataSource={data} rowKey={(record, index) => index}  pagination={{ 
                    hideOnSinglePage: false,
                    defaultPageSize: 7,

                }} />
            </Card>
        </div>
    )
}
export default Order;
