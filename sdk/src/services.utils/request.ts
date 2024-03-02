import axios, { AxiosRequestConfig, Method } from 'axios'
import { Options } from './request-types'

const request = async (method: string, path: string, options: Options) => {
  const requestOptions: AxiosRequestConfig = {
    headers: options.headers,
    baseURL: options.baseURL,
    timeout: options.timeout,
    method: method as Method,
    url: path,
    data: options.data
  }
  return axios(requestOptions).then(
    (response) => response.data,
    (err) => errorHanding(err)
  )
}

function errorHanding(error: any) {
  return Promise.reject(error.response.data)
}

export default request
