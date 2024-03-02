const OPEN = 'open';
const PICKED_UP = 'picked-up';
const IN_TRANSIT = 'in-transit';
const DELIVERED = 'delivered';
const FAILED = 'failed';

exports.OPEN = OPEN;
exports.PICKED_UP = PICKED_UP;
exports.IN_TRANSIT = IN_TRANSIT;
exports.DELIVERED = DELIVERED;
exports.FAILED = FAILED;
exports.STATUS_LIST = [OPEN, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED];
exports.DELIVERY_UPDATED = 'delivery_updated';
exports.LOCATION_CHANGED = 'location_changed';
exports.STATUS_CHANGED = 'status_changed';
