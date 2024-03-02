import DeliveryService from './services/deliveries'
import { Options } from '../../services.utils/request-types'
import * as dataSchemas from './utils/DataSchemas'
import {QueryInterface, Response, Pagination} from '../packages/utils/DataSchemas'
const objectAssignDeep = require(`object-assign-deep`)

export class Client {
  options: Options
  private deliveryService!: DeliveryService

  /**
   * Initiate client instance
   * @param options Optional. Set options for HTTP requests
   */
  constructor(options?: Options) {
    const defaultOptions = {
      headers: {},
      baseURL: "",
      version: "v1",
      timeout: 30000,
      responseType: 'json',
    }
    this.options = objectAssignDeep({}, defaultOptions, options)
  }

  /**
   * Configure client instance
   * @param options Optional. Set options for HTTP requests
   */
  configure = (options?: Options) => {
    this.options = objectAssignDeep(this.options, options)
    this.deliveryService = new DeliveryService(this.options)
  }


  getAllDeliveries = (
    getAllQuery: QueryInterface = {
      offset: 0,
      limit: 20
    }
  ): Promise<Response<Pagination<dataSchemas.DeliveryInterface>>> => this.deliveryService.getAllDeliveries({
    ...getAllQuery
  })


  getOneDelivery = (packageId: string): Promise<Response<dataSchemas.DeliveryInterface>> => this.deliveryService.getOneDelivery(packageId)

  createDelivery = (data: dataSchemas.DeliveryRequest): Promise<Response<dataSchemas.DeliveryInterface>> => this.deliveryService.createDelivery(data)

  updateDelivery = (packageId: string, data: dataSchemas.DeliveryRequest): Promise<Response<dataSchemas.DeliveryInterface>> => this.deliveryService.updateDelivery(packageId, data)

  deleteDelivery = (packageId: string): Promise<Response<boolean>> => this.deliveryService.deleteDelivery(packageId)

}

export * as types from './utils/DataSchemas'
