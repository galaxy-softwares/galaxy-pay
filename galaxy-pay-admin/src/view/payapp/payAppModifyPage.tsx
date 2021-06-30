import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react'
import { Card, Steps, Form, Button, message, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { getSoftwares } from '../../request/software'
import { createPayapp, getPayapp, updatePayapp } from '../../request/payapp'
import { useParams } from 'react-router-dom'
import { CustomForm } from '../../components/CustomFrom/customForm'
import {
  payappCustomerBasicForm,
  payappCustomerWechatForm,
  payappCustomerAlipayForm,
  payappCustomerAlipayCertificateForm
} from './payAppCustomerForm'
const { Step } = Steps

const PayAppPageModifyPage: FC = () => {
  const [form] = useForm()
  const [formData, setFormData] = useState({})
  const [payAppConfigure, setPayAppConfigure] = useState({
    current: 0,
    channel: '',
    certificate: 10,
    isEdit: false
  })
  const [payappCustomerForm, setPayappCustomerForm] = useState(payappCustomerBasicForm)
  const params = useParams<{ id: string }>()

  const initSoftwareList = useCallback(async () => {
    const { data } = await getSoftwares()
    data.map(software => {
      payappCustomerBasicForm[1].options.push({
        value: software.id,
        text: software.name
      })
    })
    const customerFormChannel = payappCustomerForm.find(({ label }) => label === '支付通道')
    customerFormChannel.onChange = (value: string) => {
      channelChange(value)
    }
    setPayappCustomerForm(payappCustomerForm)
  }, [])

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
    // 判断是支付宝还是微信
    // if (value === 'wechat') {
    //   // payAppCustomerForm
    // } else {
    // }
    setPayappCustomerForm(payappCustomerForm)
    setPayAppConfigure({
      ...payAppConfigure,
      certificate: 10,
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
    const { channel, current, certificate } = payAppConfigure
    const certificate20 = () => {
      return <CustomForm columns={payappCustomerAlipayCertificateForm} />
    }
    const certificate10 = () => {
      return <CustomForm columns={payappCustomerAlipayForm} />
    }

    if (channel == 'alipay' && current == 1) {
      if (certificate == 10) {
        return certificate10()
      } else if (certificate == 20) {
        return certificate20()
      }
    }
  }

  const wechatFormRender = () => {
    const { channel, current } = payAppConfigure
    if (current == 1 && channel == 'wechat') {
      return <CustomForm columns={payappCustomerWechatForm} />
    }
  }

  const baseFormRender = () => {
    const { current } = payAppConfigure
    if (current == 0) {
      return <CustomForm columns={payappCustomerForm} />
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
