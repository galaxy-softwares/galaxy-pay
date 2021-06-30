import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react'
import { Card, Steps, Form, Input, Button, Select, Row, Col, message, Space, Result } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { UploadFile } from '../../components/uploadFile'
import { CloudUploadOutlined } from '@ant-design/icons'
import { getSoftwares } from '../../request/software'
import { createPayapp, getPayapp, updatePayapp } from '../../request/payapp'
import { useParams } from 'react-router-dom'
const { Step } = Steps
const { Option } = Select
const PayAppPageModifyPage: FC = () => {
  const [form] = useForm()
  const [softwares, setSoftwares] = useState([])
  const [formData, setFormData] = useState({})
  const [payAppConfigure, setPayAppConfigure] = useState({
    current: 0,
    channel: '',
    certificate: 0,
    isEdit: false
  })
  const params: any = useParams()

  const payAppStep = [
    {
      title: '基础配置'
    },
    {
      title: '支付配置'
    },
    {
      title: '完成'
    }
  ]

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    setSoftwares(data)
  }, [])

  const initPayappData = useCallback(async () => {
    if (params.id) {
      const { data } = await getPayapp(params.id)
      setPayAppConfigure({
        ...payAppConfigure,
        isEdit: true,
        certificate: data.certificate,
        channel: data.channel
      })
      form.setFieldsValue({ ...data })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  useEffect(() => {
    initSoftwareList()
  }, [initSoftwareList])

  useEffect(() => {
    initPayappData()
  }, [initPayappData])

  const stepChange = (type: string) => {
    const current = type === 'next' ? payAppConfigure.current + 1 : payAppConfigure.current - 1
    if (type == 'next') {
      formValidateFields(() => {
        setPayAppConfigure({
          ...payAppConfigure,
          current: payAppConfigure.current + 1
        })
      })
    } else {
      setPayAppConfigure({
        ...payAppConfigure,
        current
      })
      form.setFieldsValue({ ...formData })
    }
  }

  // 支付通道切换
  const channelChange = (value: string) => {
    setPayAppConfigure({
      ...payAppConfigure,
      certificate: 0,
      channel: value
    })
  }
  // 支付宝证书模式选择
  const certificateChange = (value: number) => {
    setPayAppConfigure({
      ...payAppConfigure,
      certificate: value
    })
  }

  // 上传支付宝/微信证书
  const onUploadDone = data => {
    if (data) {
      form.setFieldsValue({
        [data.name]: data.path
      })
    }
  }

  // 校验表单
  const formValidateFields = (callback): void => {
    form
      .validateFields()
      .then(async (values: any) => {
        callback(values)
        setFormData({
          ...values
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const onSubmit = () => {
    formValidateFields(async values => {
      if (payAppConfigure.isEdit) {
        values.id = params.id
        const { status } = await updatePayapp({ ...values, ...formData })
        if (status == 200) {
          message.success('修改支付应用成功！')
        }
      } else {
        console.log(formData, 'formData')
        const { status } = await createPayapp({ ...values, ...formData })
        if (status == 201) {
          message.success('创建支付应用成功！')
        }
      }
      setPayAppConfigure({
        ...payAppConfigure,
        current: payAppConfigure.current + 1
      })
    })
  }

  const alipayFormRender = () => {
    const { channel, current, certificate, isEdit } = payAppConfigure
    if (channel == 'alipay' && current == 1) {
      if (certificate == 10) {
        return certificate10()
      } else if (certificate == 20) {
        return certificate20()
      }
    }
    function certificate20() {
      return (
        <>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="appid" label="APPID" rules={[{ required: true, message: '项目名称不能为空' }]}>
                <Input disabled={isEdit} placeholder="支付宝开放平台审核通过的应用APPID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="private_key"
                label="支付宝私钥"
                rules={[{ required: true, message: '项目名称不能为空' }]}
              >
                <Input disabled={isEdit} placeholder="支付宝私钥" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="app_cert_public_key"
            label="应用公钥证书"
            tooltip="appCertPublicKey_xxxx.crt"
            rules={[{ required: true, message: '应用公钥证书' }]}
          >
            <Input
              placeholder="应用公钥证书 app_cert_public_key"
              disabled={isEdit}
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
            tooltip="alipayCertPublicKey_RSA2.crt"
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
            tooltip="alipayRootCert.crt"
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
    function certificate10() {
      return (
        <>
          <Form.Item name="appid" label="APPID" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="支付宝开放平台审核通过的应用APPID" />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="public_key" label="支付宝公钥" rules={[{ required: true, message: '项目名称不能为空' }]}>
                <Input disabled={payAppConfigure.isEdit} placeholder="支付宝公钥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="private_key"
                label="支付宝私钥"
                rules={[{ required: true, message: '项目名称不能为空' }]}
              >
                <Input disabled={isEdit} placeholder="支付宝私钥" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )
    }
  }

  // 基础信息渲染
  const payAppStepBaseRender = () => {
    const { channel, current, isEdit } = payAppConfigure
    if (current == 0) {
      return base()
    }
    function base() {
      return (
        <>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item name="name" label="应用名称" rules={[{ required: true, message: '请输入应用名称' }]}>
                <Input placeholder="请输入应用名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="software_id" label="归属项目" rules={[{ required: true, message: '请选择归属项目' }]}>
                <Select disabled={isEdit} placeholder="请选择归属项目" allowClear>
                  {softwares.length > 0 ? (
                    softwares.map(item => {
                      return (
                        <>
                          <Option key={item.id} value={item.id}>
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
              <Form.Item name="callback_url" label="回调地址" tooltip="支付完成时, 本系统回调地址">
                <Input placeholder="支付完成时, 本系统回调地址" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="return_url"
                label="跳转地址"
                tooltip="当支付完成时，进行的网页跳转。APP和小程序则无需填写"
              >
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
                <Select disabled={isEdit} placeholder="请选择归属项目" onChange={channelChange}>
                  <Option value="wechat">微信支付</Option>
                  <Option value="alipay">支付宝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {channel == 'alipay' ? (
                <Form.Item
                  name="certificate"
                  label="证书模式"
                  rules={[{ required: true, message: '请选择是否是证书模式' }]}
                >
                  <Select disabled={isEdit} placeholder="请选择是否是证书模式" onChange={certificateChange}>
                    <Option value={10}>公钥书</Option>
                    <Option value={20}>公钥证书</Option>
                  </Select>
                </Form.Item>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </>
      )
    }
  }

  const payAppCreateDone = () => {
    const { current } = payAppConfigure
    if (current == 2) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle=""
          extra={[
            <Button type="primary" key="console">
              返回
            </Button>
          ]}
        />
      )
    }
  }

  const wechatFormRender = () => {
    const { channel, current } = payAppConfigure
    if (current == 1 && channel == 'wechat') {
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
  }

  return (
    <Card className="pay__app-modify">
      <div className="title">支付应用</div>
      <div className="step__content">
        <Steps current={payAppConfigure.current}>
          <Step key="基础配置" title="基础配置"></Step>
          <Step key="支付配置" title="支付配置"></Step>
        </Steps>
        <div className="form__content">
          <Form preserve={false} layout="vertical" form={form}>
            {payAppStepBaseRender()}
            {wechatFormRender()}
            {alipayFormRender()}
            <Form.Item>
              <Space>
                {payAppConfigure.current == 1 ? (
                  <>
                    <Button onClick={onSubmit} type="primary">
                      提交
                    </Button>
                    <Button type="primary" onClick={() => stepChange('pre')}>
                      上一个
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={() => stepChange('next')}>
                    下一个
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
          {payAppCreateDone()}
        </div>
      </div>
    </Card>
  )
}
export default PayAppPageModifyPage
