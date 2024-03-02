const Package = require('../packages/model');
const moment = require('moment');

const getAllSchema = {
  offset: {
    in: 'query',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    toInt: true,
    isInt: {
      options: {
        min: 0,
      },
    },
    errorMessage: `invalid offset`,
  },
  limit: {
    in: 'query',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    toInt: true,
    isInt: {
      options: {
        min: 1,
      },
    },
    errorMessage: `invalid limit`,
  },
};

const getOneSchema = {
  id: {
    in: 'params',
    isUUID: {
      version: 4,
    },
    errorMessage: `invalid delivery id`,
  },
};

const saveSchema = {
  id: {
    in: 'params',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    isUUID: {
      version: 4,
    },
    errorMessage: `invalid delivery id`,
  },
  pickup_time: {
    in: 'body',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    custom: {
      options: (value) => {
        if (!moment(value).isValid()) {
          throw new Error('Pickup time must be a valid date');
        }

        return true;
      },
    },
  },
  start_time: {
    in: 'body',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    custom: {
      options: (value) => {
        if (!moment(value).isValid()) {
          throw new Error('Start time must be a valid date');
        }

        return true;
      },
    },
  },
  end_time: {
    in: 'body',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    custom: {
      options: (value) => {
        if (!moment(value).isValid()) {
          throw new Error('End time must be a valid date');
        }

        return true;
      },
    },
  },
  status: {
    in: 'body',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    trim: true,
    isIn: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
    errorMessage:
      'Status must be one of: open, picked-up, in-transit, delivered, failed)',
  },
  location: {
    in: 'body',
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    custom: {
      options: async (value) => {
        if (value) {
          if (!value.lat || !value.lng) {
            throw new Error("Location must have 'lat' and 'lng' properties");
          } else {
            if (
              typeof value.lat !== 'number' ||
              typeof value.lng !== 'number'
            ) {
              throw new Error('Location properties must be numbers');
            }
          }
        }

        return true;
      },
    },
  },
  package_id: {
    in: 'body',
    custom: {
      options: async (value, { req }) => {
        const packageGet = await Package.findOne({ package_id: value }).lean();

        if (!packageGet) {
          throw new Error('Package not found');
        } else {
          if (req.method === 'POST') {
            //on create mode => req.method === 'POST'
            if (packageGet.active_delivery_id) {
              throw new Error('Package is not available');
            }
          } else {
            //on update mode => req.method === 'PUT'
            if (
              packageGet.active_delivery_id &&
              packageGet.active_delivery_id !== req.params.id
            ) {
              throw new Error('Package is not available');
            }
          }
        }

        return true;
      },
    },
  },
};

module.exports = {
  getAllSchema,
  getOneSchema,
  saveSchema,
};
