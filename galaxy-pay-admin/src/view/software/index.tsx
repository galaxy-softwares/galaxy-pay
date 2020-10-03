import React, { FC, useEffect, useState, useCallback } from 'react'
import {Table, notification, Card } from 'antd';
import { ModalFrom } from "../../components/modalForm";
import "./index.less";
import { Form, Tag } from 'antd';
import { softwareCreateInfo, softwareGetList, softwareUpdateInfo } from "../../request/software";
import { SoftwareFrom } from "../../components/softwareForm";
import { useDispatch } from 'react-redux';
import { softwareDetail } from "../../request/software";
import { setVisible } from '../../state/actions/modal.action';

const Software: FC = () => {
    const [ form ] = Form.useForm();
    const [data, setData]= useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [channel, setChannel]= useState('wechat');
    const dispatch = useDispatch();
    const [modalTitle, setModalTitle]= useState("项目创建");
    const initSoftware = useCallback( async () => {
        const result = await softwareGetList();
        setData(result.data)
    }, [data])
    
    useEffect( () => {
        initSoftware()
    }, [])
    
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'appid',
            dataIndex: 'appid',
            key: 'appid'
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'domain_url',
            dataIndex: 'domain_url',
            key: 'domain_url',
        },
        {
            title: '支付通道',
            dataIndex: 'channel',
            key: 'channel',
            render: (text: string) => {
                return text == 'wechat' ? <Tag color="#87d068">微信</Tag>: <Tag color="#108ee9">支付宝</Tag>
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, record: any) => (
                <>
                    <a onClick={  async () => {
                        setModalTitle("修改项目");
                        const { status, data } = await softwareDetail(record.appid, record.channel);
                        if (status == 200) {
                            setChannel(record.channel)
                            setIsEdit(true);
                            dispatch(setVisible(true))
                            form.setFieldsValue({...data})
                        }
                    }}>编辑</a>
                </>
            ),
        },
    ];

    const openNotification = (config) => {
        notification.open(config);
    }

    const create = async (form) => {
        const  { status, data }  = await softwareCreateInfo(form);
        if (status == 201) {
            openNotification({
                key: 'softwareCreate',
                type: 'success',
                message: `${form.name} 创建完成！`,
                description: '项目创建成功!',
                duration: 3,
            })
        } else {
            openNotification({
                key: 'softwareCreate',
                type: 'success',
                message: `${form.name} 创建完成！`,
                description: '项目创建成功!',
                duration: 3,
            })
        }
        dispatch(setVisible(false))
        softwareGetList().then((res: any) => {
            setData(res.data)
        })
    }

    const update = async (form) => {
        const  { status, data }  = await softwareUpdateInfo(form);
        if (status == 201) {
            openNotification({
                key: 'softwareCreate',
                type: 'success',
                message: `${form.name} 修改成功`,
                description: '项目修改成功!',
                duration: 3,
            })
        } else {
            openNotification({
                key: 'softwareCreate',
                type: 'success',
                message: `${form.name} 修改成功`,
                description: '项目修改成功!',
                duration: 3,
            })
        }
        dispatch(setVisible(false))
        softwareGetList().then((res: any) => {
            setData(res.data)
        })
    }

    return (
        <div>
            <ModalFrom title={modalTitle} onCreate={() => {
                form.validateFields()
                .then((values: any) => {
                    if (values.id) {
                        update(values)
                    } else {
                        create(values)
                    }
                    form.resetFields();
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}>
                <SoftwareFrom form={form} channel={channel} edit={isEdit} />
            </ModalFrom>
            <Card>
                <Table columns={columns} dataSource={data} rowKey={(record, index) => index} pagination={{ 
                    hideOnSinglePage: true,
                }}  />
            </Card>
        </div>
    )
}

export default Software;
