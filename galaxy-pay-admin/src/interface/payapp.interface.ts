export namespace PayappIF {
  export interface Payapp {
    id?: number
    name: string
    software_name: string
    pay_app_id: string
    pay_secret_key: string
    channel: string
    certificate: string
  }

  export interface PayappConfigure {
    current: number
    channel: string
    certificate: string
    isEdit: boolean
  }

  export type PayappList = Array<Payapp>

  export type PayappParams = Record<'name' | 'channel', string>
}
