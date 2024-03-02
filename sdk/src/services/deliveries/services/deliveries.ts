import {
  DeliveryRequest,
} from '../utils/DataSchemas'
import {
  QueryInterface
} from '../../packages/utils/DataSchemas'
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

export default class DeliveryService {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  async getAllDeliveries(getAllQuery: QueryInterface) {
    const query = getPaginationQuery(getAllQuery)
    return request('GET', `/delivery/${query}`, this.options)
  }

  async getOneDelivery(deliveryId: string) {
    return request('GET', `/delivery/${deliveryId}`, this.options)
  }

  async createDelivery(data: DeliveryRequest) {
    const requestOptions: Options = {
      ...this.options,
      data: data
    }

    return request('POST', `/delivery`, requestOptions)
  }

  async updateDelivery(deliveryId: string,data: DeliveryRequest) {
    const requestOptions: Options = {
      ...this.options,
      data: data
    }

    return request('PUT', `/delivery/${deliveryId}`, requestOptions)
  }

  async deleteDelivery(deliveryId: string) {
    return request('DELETE', `/delivery/${deliveryId}`, this.options)
  }

}
