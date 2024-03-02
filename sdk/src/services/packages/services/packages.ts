import {
  PackageRequest,
  QueryInterface
} from '../utils/DataSchemas'
import request from '../../../services.utils/request'
import {Options} from '../../../services.utils/request-types'

function getPaginationQuery(getAllQuery: QueryInterface) {
  let query = ``

  if (typeof getAllQuery.offset !== 'undefined') {
    query += `${query ? '&' : '?'}offset=${getAllQuery.offset}`
  }

  if (typeof getAllQuery.limit !== 'undefined') {
    query += `${query ? '&' : '?'}limit=${getAllQuery.limit}`
  }

  return query
}

export default class PackageService {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  async getAllPackages(getAllQuery: QueryInterface) {
    const query = getPaginationQuery(getAllQuery)
    return request('GET', `/package/${query}`, this.options)
  }

  async getOnePackage(packageId: string) {
    return request('GET', `/package/${packageId}`, this.options)
  }

  async createPackage(data: PackageRequest) {
    const requestOptions: Options = {
      ...this.options,
      data: data
    }

    return request('POST', `/package`, requestOptions)
  }

  async updatePackage(packageId: string,data: PackageRequest) {
    const requestOptions: Options = {
      ...this.options,
      data: data
    }

    return request('PUT', `/package/${packageId}`, requestOptions)
  }

  async deletePackage(packageId: string) {
    return request('DELETE', `/package/${packageId}`, this.options)
  }

}
