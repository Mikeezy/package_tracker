const mongoose = require('mongoose');
const { STATUS_LIST, OPEN } = require('../../utils/constant');

const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  delivery_id: {
    type: String,
    trim: true,
  },
  package_id: {
    type: String,
    trim: true,
  },
  pickup_time: {
    type: Date,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  location: Schema.Types.Mixed,
  status: {
    type: String,
    enum: STATUS_LIST,
    default: OPEN,
  },
});

module.exports = mongoose.model('delivery', deliverySchema);
