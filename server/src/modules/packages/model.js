const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema({
  package_id: {
    type: String,
    trim: true,
  },
  active_delivery_id: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  depth: {
    type: Number,
    default: 0,
  },
  from_name: {
    type: String,
    trim: true,
  },
  from_address: {
    type: String,
    trim: true,
  },
  from_location: Schema.Types.Mixed,
  to_name: {
    type: String,
    trim: true,
  },
  to_address: {
    type: String,
    trim: true,
  },
  to_location: Schema.Types.Mixed,
});

module.exports = mongoose.model('package', packageSchema);
