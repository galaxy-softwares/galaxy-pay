import React, {useState, useEffect} from "react";
import { Form, Input, Tabs, Radio } from 'antd';
import { QuestionCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/es/form";
const { TabPane } = Tabs;


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

interface SoftwareFromProps {
    form: FormInstance;
    chanle: string;
}

export const SoftwareFrom: React.FC<SoftwareFromProps> = ({form, chanle}) => {
    return (
        <div>
            <Form preserve={false} {...layout} form={form}>
                <div style={{display:'none'}}>
                    <Form.Item name="id" label="">
                        <Input placeholder=""/>
                    </Form.Item>
                </div>
                <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '项目名称不能为空'}]}>
                    <Input placeholder="请输入项目名称"/>
                </Form.Item>
                <Form.Item name="domain_url" label="授权域名">
                    <Input placeholder="非授权域名禁止发送支付请求，可为空！"/>
                </Form.Item>
                <Form.Item name="chanle" label="支付通道">
                <Radio.Group>
                    <Radio value="wechat">微信</Radio>
                    <Radio value="alipay">支付宝</Radio>
                    </Radio.Group>
                </Form.Item>
                { chanle === 'wechat' ?  <>
                    <Form.Item name="app_id" label="APPID" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="微信开放平台审核通过应用的APPID"/>
                    </Form.Item>
                    <Form.Item name="mch_id" label="MCHID" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="微信支付分配的商户号id"/>
                    </Form.Item>
                    <Form.Item name="mch_key" label="MCH_KEY" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="微信支付密钥"/>
                    </Form.Item>
                    <Form.Item name="app_secret" label="APP_KEY" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="开发者支付密钥"/>
                    </Form.Item>
                    <Form.Item name="ssl_cer" label="apiclient_cert.pem">
                        <Input placeholder="微信支付证书CER文件，特定操作需要验证证书"/>
                    </Form.Item>
                    <Form.Item name="ssl_key" label="apiclient_key.pem">
                        <Input placeholder="微信支付证书KEY文件，特定操作需要验证证书"/>
                    </Form.Item>
                </> : <>
                    <Form.Item name="app_id" label="APPID" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="支付宝开放平台审核通过的应用APPID"/>
                    </Form.Item>
                    <Form.Item name="public_key" label="支付宝公钥" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="支付宝公钥"/>
                    </Form.Item>
                    <Form.Item name="private_key" label="支付宝私钥" rules={[{ required: true, message: '项目名称不能为空'}]}>
                        <Input placeholder="支付宝私钥"/>
                    </Form.Item>
                </>}
            </Form>
        </div>
    );
}
