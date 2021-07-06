export namespace UserIF {
  export interface LoginParams {
    username: string
    password: string
  }

  export interface LoginResult {
    token: string
  }

  export interface UserInfo {
    avatar: string
    git_token: string
    username: string
    id: string
  }
}
