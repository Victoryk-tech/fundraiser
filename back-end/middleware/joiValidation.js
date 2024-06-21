const Joi = require("joi");

const signUpValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().required().email(),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9+ -]+$/, "numbers, spaces, plus and hyphen"),
    password: Joi.string().required().min(6),
  });
  return Schema.validate(data);
};

const signInValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  });
  return Schema.validate(data);
};
module.exports.signUpValidation = signUpValidation;
module.exports.signInValidation = signInValidation;
