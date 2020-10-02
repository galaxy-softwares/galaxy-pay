import React, {FC, useState, useCallback, useEffect} from 'react';
import "./index.less";
import { Table, Tag } from 'antd';
import {
    WechatOutlined,
    AlipayCircleOutlined
  } from '@ant-design/icons';
import { orderGetList } from '../../request/order';

const Order: FC = () => {
    const [data, setData]= useState([]);

    const initOrder = useCallback( async () => {
        const result = await orderGetList();
        setData(result.data)
    }, [data])

    useEffect( () => {
        initOrder();
    }, [])

    const orderType = {
        "refund" : {
            text: '退款',
            color: '#eb2f96'
        },
        "withdrawal" : {
            text: '提现',
            color: '#fa8c16'
        },
        "pay" : {
            text: '支付',
            color: '#13c2c2'
        },
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '订单号',
            dataIndex: 'out_trade_no',
            key: 'out_trade_no',
        },
        {
            title: '项目名称',
            dataIndex: 'software',
            key: 'software',
            render: (software: any) => {
                return  <Tag color="#f50">{software.name}</Tag>
            },
        },
        {
            title: 'appid',
            dataIndex: 'appid',
            key: 'appid'
        },
        {
            title: '订单金额',
            dataIndex: 'order_money',
            key: 'order_money',
        },
        {
            title: '订单类型',
            dataIndex: 'order_type',
            key: 'order_type',
            render: (text: string) => {
                return  <Tag color={orderType[text].color}>{orderType[text].text}</Tag>;
            },
        },
        {
            title: '订单状态',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (text: number) => {
                return text == 1 ? <Tag color="#87d068">已完成</Tag>: <Tag color="#108ee9">未完成</Tag>
            },
        },
        {
            title: '支付通道',
            dataIndex: 'order_channel',
            key: 'order_channel',
            render: (text: string) => {
            return text === 'wechat' ? <Tag icon={<WechatOutlined />} color="#87d068">微信</Tag>: <Tag icon={<AlipayCircleOutlined />} color="#2db7f5">支付宝</Tag>
            },
        },
    ];
    return (
        <div>
        <Table columns={columns} dataSource={data} rowKey={(record, index) => index}  />
        </div>
    )
}
export default Order;
