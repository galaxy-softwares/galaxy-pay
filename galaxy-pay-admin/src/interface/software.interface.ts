export namespace SoftwareIF {
  export interface Software {
    id?: number
    name: string
    callback_url: string
    return_url: string
  }
  export type SoftwareEdit = Required<Software>
  export type SoftwareList = Array<Software>
}
