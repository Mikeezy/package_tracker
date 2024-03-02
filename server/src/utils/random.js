const { v4: uuidv4 } = require('uuid');

exports.generateGuid = async function generateGuid(schema, fields) {
  const code = uuidv4();

  const result = await schema
    .findOne({
      [fields]: code,
    })
    .exec();

  if (result === null || typeof result._id === 'undefined') {
    return code;
  } else {
    return generateGuid(schema, fields);
  }
};
