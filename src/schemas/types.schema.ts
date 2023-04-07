import Joi from 'joi';
import isURL from 'validator/lib/isURL';
import { LENGTH } from '../utils/nanoid.util';

const Uuid = () =>
  Joi.string().trim().lowercase().uuid({ version: 'uuidv4' }).required();

const Url = () =>
  Joi.string()
    .trim()
    .min(5)

    .custom((value, ctx) => {
      //console.log({ value });
      const isUrl = isURL(value, {
        host_blacklist: process.env.BLACK_LIST_URL?.split(','),
      });

      return isUrl ? value : ctx.error('any.unknown');
    })
    .required();

const nanoId = () => Joi.string().min(LENGTH).max(LENGTH).trim().required();

export { Uuid, Url, nanoId };
