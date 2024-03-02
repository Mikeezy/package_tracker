import { LocationInterface } from '../../packages/utils/DataSchemas';

export interface DeliveryInterface {
  _id: string;
  delivery_id: string;
  package_id: string;
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location?: LocationInterface;
  status: DeliveryStatus;
}

export enum DeliveryStatus {
  OPEN = 'open',
  PICKED_UP = 'picked-up',
  IN_TRANSIT = 'in-transit',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

export interface DeliveryRequest {
  package_id: string;
  location?: LocationInterface;
}