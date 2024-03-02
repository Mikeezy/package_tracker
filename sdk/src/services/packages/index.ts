import PackagesService from './services/packages'
import { Options } from '../../services.utils/request-types'
import * as dataSchemas from './utils/DataSchemas'
const objectAssignDeep = require(`object-assign-deep`)

export class Client {
  options: Options
  private packagesService!: PackagesService

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
    this.packagesService = new PackagesService(this.options)
  }


  getAllPackages = (
    getAllQuery: dataSchemas.QueryInterface = {
      offset: 0,
      limit: 20
    }
  ): Promise<dataSchemas.Response<dataSchemas.Pagination<dataSchemas.PackageInterface>>> => this.packagesService.getAllPackages({
    ...getAllQuery
  })


  getOnePackage = (packageId: string): Promise<dataSchemas.Response<dataSchemas.PackageInterface>> => this.packagesService.getOnePackage(packageId)

  createPackage = (data: dataSchemas.PackageRequest): Promise<dataSchemas.Response<dataSchemas.PackageInterface>> => this.packagesService.createPackage(data)

  updatePackage = (packageId: string, data: dataSchemas.PackageRequest): Promise<dataSchemas.Response<dataSchemas.PackageInterface>> => this.packagesService.updatePackage(packageId, data)

  deletePackage = (packageId: string): Promise<dataSchemas.Response<boolean>> => this.packagesService.deletePackage(packageId)

}

export * as types from './utils/DataSchemas'
