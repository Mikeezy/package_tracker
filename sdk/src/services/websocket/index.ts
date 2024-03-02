import { LocationChangedPayloadInterface, StatusChangedPayloadInterface, DeliveryChangedPayloadInterface, initSocketInterface } from './utils/DataSchemas'
import { Options } from '../../services.utils/request-types'
const objectAssignDeep = require(`object-assign-deep`)

export class Client {
  options: Options
  private websocket!: any;

  constructor(options?: Options) {
    this.options = objectAssignDeep({}, options)
  }


  configure = (options?: Options) => {
    this.options = objectAssignDeep(this.options, options)
  }


  initSocket({
    onConnected,
    onDisconnected,
    onDeliveryUpdate
  }: initSocketInterface) {
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      this.websocket = new WebSocket(
        `${this.options.socketEndpoint}`
      );
    }

    this.websocket.onopen = onConnected;

    this.websocket.onerror = (error: any) => {
      console.error("WebSocket Error ", error);
    };

    this.websocket.onclose = function (e: any) {

      if (e.reason !== "logout") {
        console.log(
          "Socket is closed. Reconnect will be attempted in 1 second.",
          e.reason
        );

        setTimeout(onDisconnected, 1000);
      }
    };

    this.websocket.onmessage = (event_: any) => {
      const { event, delivery_object }: DeliveryChangedPayloadInterface = JSON.parse(event_.data.toString());
      switch (event) {
        case "delivery_updated":
          onDeliveryUpdate(delivery_object);
          break;
        default:
          break;
      }
    }

  }

  closeSocket = () => {
    this.websocket?.close(1000, "logout");
  }

  locationChanged = async ({ delivery_id, location }: LocationChangedPayloadInterface): Promise<void> => {
    this.websocket && this.websocket.send(JSON.stringify({
      event: "location_changed",
      delivery_id,
      location
    }));
  }

  StatusChanged = async ({ delivery_id, status }: StatusChangedPayloadInterface): Promise<void> => {
    this.websocket && this.websocket.send(JSON.stringify({
      event: "status_changed",
      delivery_id,
      status
    }));
  }
}

export * as types from './utils/DataSchemas'