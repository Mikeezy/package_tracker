const express = require('express');
const deliveryRouter = require('../../modules/deliveries/router');
const packageRouter = require('../../modules/packages/router');

const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

router.use('/delivery', deliveryRouter);
router.use('/package', packageRouter);

module.exports = router;
