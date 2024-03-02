import { LocationInterface } from '../../packages/utils/DataSchemas';
import { DeliveryStatus, DeliveryInterface } from '../../deliveries/utils/DataSchemas';

export interface LocationChangedPayloadInterface {
  delivery_id: string;
  location: LocationInterface;
}

export interface StatusChangedPayloadInterface {
  delivery_id: string;
  status: DeliveryStatus;
}

export interface DeliveryChangedPayloadInterface {
  event: string;
  delivery_object: DeliveryInterface;
}

export interface initSocketInterface{
  onConnected: () => void;
  onDisconnected: () => void;
  onDeliveryUpdate: (delivery: DeliveryInterface) => void;
}