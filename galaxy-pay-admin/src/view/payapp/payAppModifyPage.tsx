import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react'
import { Card, Steps, Form, Input, Button, message, Space, Select, Col } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { createPayapp, getPayapp, updatePayapp } from '../../request/payapp'
import { useHistory, useParams } from 'react-router-dom'
import { CustomerFormColumns, CustomForm } from '../../components/CustomFrom/customForm'
import { CloudUploadOutlined } from '@ant-design/icons'
import {
  initPayappCustomerBasicForm,
  payappCustomerWechatForm,
  payappCustomerAlipayForm,
  payappCustomerAlipayCertificateForm
} from './payAppCustomerForm'
import { UploadFile } from '../../components/uploadFile'

const { Step } = Steps
const { Option } = Select
const PayAppPageModifyPage: FC = () => {
  const [form] = useForm()
  const [formData, setFormData] = useState({})
  const history = useHistory()
  const [payAppConfigure, setPayAppConfigure] = useState({
    current: 0,
    channel: '',
    certificate: 0,
    isEdit: false
  })

  const [payappCustomerForm, setPayappCustomerForm] = useState<CustomerFormColumns>([])
  const params = useParams<{ id: string }>()

  const initCustomerFormData = useCallback(async () => {
    const payappCustomerBasicForm = await initPayappCustomerBasicForm()
    // 后期打算放到redux 中
    const customerFormChannel = payappCustomerBasicForm.find(({ label }) => label === '支付通道')
    customerFormChannel.onChange = (value: string) => {
      setPayAppConfigure({
        ...payAppConfigure,
        channel: value
      })
    }
    setPayappCustomerForm(payappCustomerBasicForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    initCustomerFormData()
  }, [initCustomerFormData])

  const initPayappData = useCallback(async () => {
    if (params.id) {
      const { data } = await getPayapp(+params.id)
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
    initPayappData()
  }, [initPayappData])

  // step 切换
  const stepChange = (type: string) => {
    const current = type === 'next' ? payAppConfigure.current + 1 : payAppConfigure.current - 1
    if (type == 'next') {
      formValidateFields(() => {
        setPayAppConfigure({
          ...payAppConfigure,
          current: current
        })
      })
    } else {
      setPayAppConfigure({
        ...payAppConfigure,
        current
      })
      setFormData({
        ...formData,
        ...form.getFieldsValue()
      })
    }
    form.setFieldsValue({ ...formData })
  }

  // 支付宝证书模式选择
  const certificateChange = (value: number) => {
    setPayAppConfigure({
      ...payAppConfigure,
      certificate: value
    })
  }
  // 上传支付宝/微信证书
  const onUploadDone = ({ name, path }) => {
    console.log(name, path)
    form.setFieldsValue({
      [name]: path
    })
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

  // 提交表单
  const onSubmit = () => {
    formValidateFields(async values => {
      if (payAppConfigure.isEdit) {
        values.id = params.id
        const { status } = await updatePayapp({ ...values, ...formData })
        if (status == 200) {
          message.success('修改支付应用成功！')
        }
      } else {
        const { status } = await createPayapp({ ...values, ...formData })
        if (status == 201) {
          message.success('创建支付应用成功！')
        }
      }
      history.push('/payapps')
    })
  }

  // 支付宝证书模式渲染
  const alipayCertificateRender = (): JSX.Element => {
    const { current, isEdit, channel } = payAppConfigure
    if (current == 1 && channel == 'alipay') {
      return (
        <Form.Item
          name="certificate"
          label="支付宝证书模式"
          rules={[{ required: true, message: '请选择支付宝证书模式' }]}
        >
          <Select disabled={isEdit} placeholder="请选择支付宝证书模式" onChange={certificateChange}>
            <Option value={10}>公钥</Option>
            <Option value={20}>公钥证书</Option>
          </Select>
        </Form.Item>
      )
    }
  }

  // 支付宝渲染
  const alipayFormRender = () => {
    const { channel, current, certificate, isEdit } = payAppConfigure
    if (channel == 'alipay' && current == 1) {
      if (certificate == 10) {
        return certificate10()
      } else if (certificate == 20) {
        return certificate20()
      }
    }
    function certificate10() {
      return <CustomForm isEdit={isEdit} columns={payappCustomerAlipayForm} />
    }

    // 微信支付
    function certificate20() {
      return (
        <CustomForm isEdit={isEdit} columns={payappCustomerAlipayCertificateForm}>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
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
          </Col>
        </CustomForm>
      )
    }
  }

  // 微信支付
  const wechatFormRender = () => {
    const { channel, current, isEdit } = payAppConfigure
    if (current == 1 && channel == 'wechat') {
      return (
        <CustomForm isEdit={isEdit} columns={payappCustomerWechatForm}>
          <Col span={24}>
            <Form.Item name="apiclient_cert" label="微信证书" tooltip="apiclient_cert.crt">
              <Input
                placeholder="微信证书 apiclient_cert"
                disabled
                addonAfter={
                  <UploadFile name="apiclient_cert" uploadSuccess={onUploadDone}>
                    <CloudUploadOutlined />
                  </UploadFile>
                }
              />
            </Form.Item>
          </Col>
        </CustomForm>
      )
    }
  }

  // 基础配置项渲染
  const baseFormRender = () => {
    const { current, isEdit } = payAppConfigure
    if (current == 0) {
      return <CustomForm isEdit={isEdit} columns={payappCustomerForm} />
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
            {baseFormRender()}
            {wechatFormRender()}
            {alipayCertificateRender()}
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
        </div>
      </div>
    </Card>
  )
}
export default PayAppPageModifyPage
