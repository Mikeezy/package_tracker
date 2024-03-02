export interface PackageInterface {
  _id: string;
  package_id: string;
  active_delivery_id: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: LocationInterface;
  to_name: string;
  to_address: string;
  to_location: LocationInterface;
}

export interface LocationInterface {
  lat: number;
  lng: number;
}

export interface PackageRequest {
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: LocationInterface;
  to_name: string;
  to_address: string;
  to_location: LocationInterface;
}

export interface QueryInterface {
  offset: number;
  limit: number;
}

export interface Pagination<T> {
  total: number;
  data: Array<T>;
}

export interface Response<T> {
  success: boolean;
  data: T;
  code?: string;
  message?: string;
  property?: string;
}