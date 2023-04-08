import process from 'node:process';

import type { CustomHelpers } from 'joi';
import Joi from 'joi';

import isURL from 'validator/lib/isURL';
import { LENGTH } from '../utils/nanoid.util';

export const Uuid = () => {
  return Joi.string().trim().lowercase().uuid({ version: 'uuidv4' }).required();
};

export const Url = () => {
  function custom(currentUrl: string, context: CustomHelpers<string>) {
    const isUrl = isURL(currentUrl, {
      host_blacklist: process.env.BLACK_LIST_URL?.split(','),
    });

    return isUrl ? currentUrl : context.error('any.unknown');
  }

  return Joi.string().trim().min(5).custom(custom).required();
};

export const NanoId = () => {
  return Joi.string().min(LENGTH).max(LENGTH).trim().required();
};
