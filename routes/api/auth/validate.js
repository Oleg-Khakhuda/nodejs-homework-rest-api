import Joi from 'joi';
import { HttpCode } from '../../../lib/constants.js';

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
})

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
})

export const validateUpdateSubscription = async (req, res, next) => {
  try {
    await updateSubscriptionSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: err.message.replace(/"/g, '') });
  }
  next();
}

export const validateAuth = async (req, res, next) => {
  try {
    await authSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: err.message.replace(/"/g, '') });
  }
  next();
};