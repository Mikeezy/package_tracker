const logger = require('./logger');
const config = require('../../config');
const {
  ERROR,
  VALIDATION_ERROR,
  PROPERTY_INVALID,
} = require('../utils/errorCode');

class MyError extends Error {
  constructor(message) {
    super(message);
    this.isLogged = true;
    this.isOperationalError = true;
    this.name = this.constructor.name;
  }
}

class ValidationError extends MyError {
  constructor(message, isLogged = false) {
    super(message);
    this.isLogged = isLogged;
    this.code = VALIDATION_ERROR;
  }
}

class PropertyInvalidWithErrorMessage extends ValidationError {
  constructor(property, message, isLogged = false) {
    super(message, isLogged);
    this.property = property;
    this.code = PROPERTY_INVALID;
  }
}

class PropertyInvalidError extends PropertyInvalidWithErrorMessage {
  constructor(property, isLogged = false) {
    super(
      property,
      `${property} is required or invalid, please retry !`,
      isLogged,
    );
  }
}

class CustomError extends MyError {
  constructor(message, code = ERROR, isLogged = false) {
    super(message);
    this.isLogged = isLogged;
    this.code = code;
  }
}

class CustomSimpleError extends CustomError {
  constructor(isLogged = false) {
    super(
      `Operation failure, it seems like something went wrong, please retry !`,
      ERROR,
      isLogged,
    );
  }
}

function isOperationalError(error) {
  return error.isOperationalError;
}

function logError(error) {
  if (typeof error.isLogged === 'undefined' || error.isLogged) {
    logger.error(
      `\nName : ${error.name || ''} \nMessage : ${
        error.message || ''
      } \nCode : ${error.code || ''} \nStack : ${error.stack || ''}`,
    );
  }

  return;
}

async function handleError(error) {
  const check = isOperationalError(error);

  if (config.get('nodeEnv') !== 'development' && !check) {
    logError(error);
  }

  return check;
}

module.exports = {
  MyError,
  ValidationError,
  PropertyInvalidError,
  PropertyInvalidWithErrorMessage,
  CustomError,
  CustomSimpleError,
  isOperationalError,
  logError,
  handleError,
};
