import React, {FC, useState, useCallback, useEffect} from 'react';
import "./index.less";
import { Table, Tag } from 'antd';
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
            title: '订单状态',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (text: number) => {
                return text == 1 ? <Tag color="#87d068">已支付</Tag>: <Tag color="#108ee9">未支付</Tag>
            },
        },
        {
            title: '支付通道',
            dataIndex: 'order_channel',
            key: 'order_channel',
            render: (text: string) => {
                return text === 'wechat' ? <Tag color="#87d068">微信</Tag>: <Tag color="#108ee9">支付宝</Tag>
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
