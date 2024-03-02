const express = require('express');
const validator = require('express-validator');
const validationHandlerMiddleware = require('../../middlewares/validationHandlerMiddleware');
const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const responseHandlerMiddleware = require('../../middlewares/responseHandlerMiddleware');
const { getAll, getOne, create, update, deleteOne } = require('./controller');
const validationSchema = require('./validation');

const router = express.Router();

router.get(
  '/',
  validator.checkSchema(validationSchema.getAllSchema),
  validationHandlerMiddleware,
  asyncMiddleware(async (req, res, next) => {
    const data = {
      ...req.query,
    };

    res.locals.data = await getAll(data);
    next();
  }),
  responseHandlerMiddleware,
);

router.get(
  '/:id',
  validator.checkSchema(validationSchema.getOneSchema),
  validationHandlerMiddleware,
  asyncMiddleware(async (req, res, next) => {
    res.locals.data = await getOne(req.params.id);
    next();
  }),
  responseHandlerMiddleware,
);

router.post(
  '/',
  validator.checkSchema(validationSchema.saveSchema),
  validationHandlerMiddleware,
  asyncMiddleware(async (req, res, next) => {
    const data = {
      ...req.body,
    };
    res.locals.data = await create(data);
    next();
  }),
  responseHandlerMiddleware,
);

router.put(
  '/:id',
  validator.checkSchema(validationSchema.saveSchema),
  validationHandlerMiddleware,
  asyncMiddleware(async (req, res, next) => {
    const data = {
      ...req.body,
    };
    res.locals.data = await update(req.params.id, data);
    next();
  }),
  responseHandlerMiddleware,
);

router.delete(
  '/:id',
  validator.checkSchema(validationSchema.getOneSchema),
  validationHandlerMiddleware,
  asyncMiddleware(async (req, res, next) => {
    res.locals.data = await deleteOne(req.params.id);
    next();
  }),
  responseHandlerMiddleware,
);

module.exports = router;
