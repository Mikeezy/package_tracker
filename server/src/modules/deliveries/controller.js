const Delivery = require('./model');
const Package = require('../packages/model');
const { generateGuid } = require('../../utils/random');
const eventEmitter = require('../../utils/eventEmitter');
const { DELIVERY_UPDATED, DELIVERED, FAILED } = require('../../utils/constant');

exports.getAll = async ({ offset = 0, limit = 5 }) => {
  const request = {};

  const dataPromise = Delivery.find(request).skip(+offset).limit(+limit);

  const totalPromise = Delivery.find(request).countDocuments();

  const [data, total] = await Promise.all([dataPromise, totalPromise]);

  return {
    total,
    data,
  };
};

exports.getOne = async (id) => {
  const data = await Delivery.findOne({ delivery_id: id });

  return data;
};

exports.create = async (info) => {
  const info_ = { ...info };
  info_.delivery_id = await generateGuid(Delivery, 'delivery_id');

  const data = await new Delivery(info_).save();

  await Package.findOneAndUpdate(
    { package_id: data.package_id },
    { $set: { active_delivery_id: data.delivery_id } },
    { new: true },
  );

  return data;
};

exports.update = async (id, info) => {
  const getDelivery = await Delivery.findOne({ delivery_id: id }).lean();

  if (info.package_id) {
    if (getDelivery.package_id !== info.package_id) {
      await Promise.all([
        Package.findOneAndUpdate(
          { package_id: getDelivery.package_id },
          { $set: { active_delivery_id: '' } },
          { new: true },
        ),
        Package.findOneAndUpdate(
          { package_id: info.package_id },
          { $set: { active_delivery_id: getDelivery.delivery_id } },
          { new: true },
        ),
      ]);
    }
  }

  const data = await Delivery.findOneAndUpdate(
    { delivery_id: id },
    { $set: info },
    { new: true },
  );

  if (info.status === DELIVERED || info.status === FAILED) {
    await Package.findOneAndUpdate(
      { package_id: data.package_id },
      { $set: { active_delivery_id: '' } },
    );
  }

  eventEmitter.emit(DELIVERY_UPDATED, data);

  return data;
};

exports.deleteOne = async (id) => {
  const data = await Delivery.findOne({ delivery_id: id });

  if (data.package_id) {
    await Package.findOneAndUpdate(
      { package_id: data.package_id },
      { $set: { active_delivery_id: '' } },
    );
  }

  await Delivery.findOneAndDelete({ delivery_id: id });

  return true;
};
