// eslint-disable-next-line no-unused-vars
import { AxiosRequestConfig } from 'axios'

export interface Options extends AxiosRequestConfig {
  version?: string
  baseURL?: string
  timeout?: number
  socketEndpoint?: string
}
