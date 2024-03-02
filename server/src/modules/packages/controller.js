const Package = require('./model');
const { generateGuid } = require('../../utils/random');

exports.getAll = async ({ offset = 0, limit = 5 }) => {
  const request = {};

  const dataPromise = Package.find(request).skip(+offset).limit(+limit);

  const totalPromise = Package.find(request).countDocuments();

  const [data, total] = await Promise.all([dataPromise, totalPromise]);

  return {
    total,
    data,
  };
};

exports.getOne = async (id) => {
  const data = await Package.findOne({ package_id: id });

  return data;
};

exports.create = async (info) => {
  const info_ = { ...info };
  info_.package_id = await generateGuid(Package, 'package_id');

  const data = await new Package(info_).save();

  return data;
};

exports.update = async (id, info) => {
  const data = await Package.findOneAndUpdate(
    { package_id: id },
    { $set: info },
    { new: true },
  );

  return data;
};

exports.deleteOne = async (id) => {
  await Package.findOneAndDelete({ package_id: id });

  return true;
};
