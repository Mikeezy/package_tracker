const DeliveryController = require('./deliveries/controller');
const {
  LOCATION_CHANGED,
  STATUS_CHANGED,
  OPEN,
  PICKED_UP,
  IN_TRANSIT,
  DELIVERED,
  FAILED,
} = require('../utils/constant');

exports.handleIncomingMessage = async (message) => {
  try {
    const messageString = message.toString('utf-8');
    const messageParsed = JSON.parse(messageString);

    if (messageParsed.event === LOCATION_CHANGED) {
      const { delivery_id, location } = messageParsed;
      if (
        delivery_id &&
        location.lat &&
        location.lng &&
        typeof location.lat === 'number' &&
        typeof location.lng === 'number'
      ) {
        await DeliveryController.update(delivery_id, { location });
      }
    }

    if (messageParsed.event === STATUS_CHANGED) {
      const { delivery_id, status } = messageParsed;

      if (delivery_id && status) {
        const data = { status: status };
        const delivery = await DeliveryController.getOne(delivery_id);
        if (delivery) {
          const currentStatus = delivery.status;

          if (currentStatus === OPEN && status === PICKED_UP) {
            data.pickup_time = new Date();
          }

          if (currentStatus === PICKED_UP && status === IN_TRANSIT) {
            data.start_time = new Date();
          }

          if (
            currentStatus === IN_TRANSIT &&
            (status === DELIVERED || status === FAILED)
          ) {
            data.end_time = new Date();
          }

          await DeliveryController.update(delivery_id, data);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
