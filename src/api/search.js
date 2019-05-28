const Boom = require('boom');
const Joi = require('joi');
const { search, findUserById } = require('../searching');

/* eslint-disable no-extra-boolean-cast,no-param-reassign */
const userIdValidator = params => {
  const { error, value } = Joi.validate(params.userId, Joi.number());
  if (!!error) throw error;

  try {
    findUserById(value);
    params.userId = value;
  } catch (err) {
    throw Boom.badRequest('Incorrect user id');
  }
};
module.exports = {
  path: '/movies/user/{userId}/search',
  method: 'GET',
  handler: (request, h) => {
    const { userId } = request.params;
    const searhTerm = request.query.text;

    return search(userId, searhTerm);
  },
  options: {
    validate: {
      params: userIdValidator,
      query: {
        text: Joi.string().required(),
      },
    },
  },
};
