import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react'
import { Card, Form, Input, Button, Select, Row, Col, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { UploadFile } from '../../components/uploadFile'
import { CloudUploadOutlined } from '@ant-design/icons'
import { getSoftwares } from '../../request/software'
import { createPayapp, getPayapp, updatePayapp } from '../../request/payapp'
import { useParams } from 'react-router-dom'
const { Option } = Select
const PayAppPageModifyPage: FC = () => {
  const [form] = useForm()
  const [formChannel, setFormChannel] = useState('')
  const [certificate, setCertificate] = useState(0)
  const [softwares, setSoftwares] = useState([])

  const params: any = useParams()

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    setSoftwares(data)
  }, [])

  useEffect(() => {
    initSoftwareList()
  }, [initSoftwareList])

  useEffect(() => {
    if (params.id) {
      const initPayappData = async () => {
        const { data } = await getPayapp(params.id)
        setFormChannel(data.channel)
        setCertificate(data.certificate ? data.certificate : 0)
        form.setFieldsValue({ ...data })
      }
      initPayappData()
    }
  }, [form, params.id])

  const channelChange = (value: string) => {
    setFormChannel(value)
    setCertificate(0)
  }

  const certificateChange = (value: number) => {
    setCertificate(value)
  }

  const onUploadDone = data => {
    if (data) {
      form.setFieldsValue({
        [data.name]: data.path
      })
    }
  }

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        if (params.id) {
          values.id = params.id
          const { status } = await updatePayapp(values)
          if (status == 200) {
            message.success('修改支付应用成功！')
          }
        } else {
          const { status } = await createPayapp(values)
          if (status == 201) {
            message.success('创建支付应用成功！')
          }
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const alipayFormRender = () => {
    if (formChannel == 'alipay') {
      if (certificate == 10) {
        return (
          <>
            <Form.Item name="appid" label="APPID" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="支付宝开放平台审核通过的应用APPID" />
            </Form.Item>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  name="public_key"
                  label="支付宝公钥"
                  rules={[{ required: true, message: '项目名称不能为空' }]}
                >
                  <Input placeholder="支付宝公钥" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="private_key"
                  label="支付宝私钥"
                  rules={[{ required: true, message: '项目名称不能为空' }]}
                >
                  <Input placeholder="支付宝私钥" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      } else if (certificate == 20) {
        return (
          <>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  name="public_key"
                  label="支付宝公钥"
                  rules={[{ required: true, message: '项目名称不能为空' }]}
                >
                  <Input placeholder="支付宝公钥" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="private_key"
                  label="支付宝私钥"
                  rules={[{ required: true, message: '项目名称不能为空' }]}
                >
                  <Input placeholder="支付宝私钥" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="appid" label="APPID" rules={[{ required: true, message: '项目名称不能为空' }]}>
              <Input placeholder="支付宝开放平台审核通过的应用APPID" />
            </Form.Item>
            <Form.Item
              name="app_cert_public_key"
              label="应用公钥证书"
              extra="appCertPublicKey_xxxx.crt"
              rules={[{ required: true, message: '应用公钥证书' }]}
            >
              <Input
                placeholder="应用公钥证书 app_cert_public_key"
                disabled
                addonAfter={
                  <UploadFile name="app_cert_public_key" uploadSuccess={onUploadDone}>
                    <CloudUploadOutlined />
                  </UploadFile>
                }
              />
            </Form.Item>
            <Form.Item
              name="alipay_cert_public_key_rsa2"
              label="支付宝公钥证书"
              extra="alipayCertPublicKey_RSA2.crt"
              rules={[{ required: true, message: '支付宝公钥证书' }]}
            >
              <Input
                placeholder="应用公钥证书 alipay_cert_public_key_rsa2"
                disabled
                addonAfter={
                  <UploadFile name="alipay_cert_public_key_rsa2" uploadSuccess={onUploadDone}>
                    <CloudUploadOutlined />
                  </UploadFile>
                }
              />
            </Form.Item>
            <Form.Item
              name="alipay_root_cert"
              label="支付宝根证书"
              extra="alipayRootCert.crt"
              rules={[{ required: true, message: '支付宝根证书' }]}
            >
              <Input
                placeholder="支付宝根证书 alipay_root_cert"
                disabled
                addonAfter={
                  <UploadFile name="alipay_root_cert" uploadSuccess={onUploadDone}>
                    <CloudUploadOutlined />
                  </UploadFile>
                }
              />
            </Form.Item>
          </>
        )
      }
    }
  }

  const wechatFormRender = () => {
    return (
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <Form.Item name="appid" label="APPID" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="微信开放平台审核通过应用的APPID" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="mch_id" label="MCHID" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="微信支付分配的商户号id" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="mch_key" label="MCH_KEY" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="微信支付密钥" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="app_secret" label="APP_KEY" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="开发者支付密钥" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="apiclient_cert" label="apiclient_cert">
            <Input
              placeholder="证书文件，特定操作需要！"
              addonAfter={
                <UploadFile name="apiclient_cert" uploadSuccess={onUploadDone} accept={'*'}>
                  <CloudUploadOutlined />
                </UploadFile>
              }
            />
          </Form.Item>
        </Col>
      </Row>
    )
  }
  return (
    <Card className="pay__app-modify">
      <div className="title">支付应用添加</div>
      <Form preserve={false} layout="vertical" form={form}>
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Form.Item name="name" label="应用名称" rules={[{ required: true, message: '请输入应用名称' }]}>
              <Input placeholder="请输入应用名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="software_id" label="归属项目" rules={[{ required: true, message: '请选择归属项目' }]}>
              <Select placeholder="请选择归属项目" allowClear>
                {softwares.length > 0 ? (
                  softwares.map((item, index) => {
                    return (
                      <>
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      </>
                    )
                  })
                ) : (
                  <></>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="pay_app_type" label="应用类型" rules={[{ required: true, message: '请选择应用类型' }]}>
              <Select placeholder="请选择应用类型">
                <Option value="h5">H5</Option>
                <Option value="wechat_small">小程序</Option>
                <Option value="app">app支付</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="notify_url"
              label="支付通知地址"
              tooltip="支付完成时, 支付系统通知地址"
              rules={[{ required: true, message: '请输入notify_url' }]}
            >
              <Input placeholder="支付完成时, 支付系统通知地址" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="callback_url"
              label="回调地址"
              tooltip="支付完成时, 本系统回调地址"
              rules={[{ required: true, message: '请输入callback_url' }]}
            >
              <Input placeholder="支付完成时, 本系统回调地址" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="return_url" label="跳转地址" tooltip="当支付完成时，进行的网页跳转。APP和小程序则无需填写">
              <Input placeholder="支付完成后跳转页面,PC端 支付必填！" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="domain_url"
              label="授权域名"
              tooltip="授权域名,非授权域名则无法成功调用支付, 多个域名用逗号隔开。不限制则填写 * "
              rules={[{ required: true, message: '授权域名不能为空' }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 2 }}
                placeholder="授权域名,非授权域名则无法成功调用支付, 多个域名用逗号隔开。不限制则填写 *"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="channel" label="支付通道" rules={[{ required: true, message: '请选择支付通道' }]}>
              <Select placeholder="请选择归属项目" onChange={channelChange}>
                <Option value="wechat">微信支付</Option>
                <Option value="alipay">支付宝</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {formChannel == 'alipay' ? (
              <Form.Item
                name="certificate"
                label="证书模式"
                rules={[{ required: true, message: '请选择是否是证书模式' }]}
              >
                <Select placeholder="请选择是否是证书模式" onChange={certificateChange}>
                  <Option value={10}>公钥书</Option>
                  <Option value={20}>公钥证书</Option>
                </Select>
              </Form.Item>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        {formChannel == 'wechat' ? wechatFormRender() : <></>}
        {alipayFormRender()}
        <Form.Item>
          <Button onClick={onSubmit} type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default PayAppPageModifyPage
