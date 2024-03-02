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
    errorMessage: `invalid package id`,
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
    errorMessage: `invalid package id`,
  },
  description: {
    in: 'body',
    trim: true,
    isLength: {
      errorMessage: 'Description must be at least 2 chars long',
      options: {
        min: 2,
      },
    },
  },
  weight: {
    in: 'body',
    toInt: true,
    isInt: {
      errorMessage: 'Weight must be a number greater than 0',
      options: {
        min: 1,
      },
    },
  },
  width: {
    in: 'body',
    toInt: true,
    isInt: {
      errorMessage: 'Width must be a number greater than 0',
      options: {
        min: 1,
      },
    },
  },
  height: {
    in: 'body',
    toInt: true,
    isInt: {
      errorMessage: 'Height must be a number greater than 0',
      options: {
        min: 1,
      },
    },
  },
  depth: {
    in: 'body',
    toInt: true,
    isInt: {
      errorMessage: 'Depth must be a number greater than 0',
      options: {
        min: 1,
      },
    },
  },
  from_name: {
    in: 'body',
    trim: true,
    isLength: {
      errorMessage: 'From name must be at least 2 chars long',
      options: {
        min: 2,
      },
    },
  },
  from_address: {
    in: 'body',
    trim: true,
    isLength: {
      errorMessage: 'From address must be at least 2 chars long',
      options: {
        min: 2,
      },
    },
  },
  from_location: {
    in: 'body',
    custom: {
      options: async (value) => {
        if (!value.lat || !value.lng) {
          throw new Error("Location must have 'lat' and 'lng' properties");
        } else {
          if (typeof value.lat !== 'number' || typeof value.lng !== 'number') {
            throw new Error('Location properties must be numbers');
          }
        }

        return true;
      },
    },
  },
  to_name: {
    in: 'body',
    trim: true,
    isLength: {
      errorMessage: 'To name must be at least 2 chars long',
      options: {
        min: 2,
      },
    },
  },
  to_address: {
    in: 'body',
    trim: true,
    isLength: {
      errorMessage: 'To address must be at least 2 chars long',
      options: {
        min: 2,
      },
    },
  },
  to_location: {
    in: 'body',
    custom: {
      options: async (value) => {
        if (!value.lat || !value.lng) {
          throw new Error("Location must have 'lat' and 'lng' properties");
        } else {
          if (typeof value.lat !== 'number' || typeof value.lng !== 'number') {
            throw new Error('Location properties must be numbers');
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
