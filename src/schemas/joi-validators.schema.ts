import Joi from 'joi';
import { NanoId, Url, Uuid } from './types.schema';

export const NanoIdParam = () => {
  return Joi.object().keys({ hash: NanoId() });
};

export const UuidParam = () => {
  return Joi.object().keys({ id: Uuid() });
};

export const UrlParam = () => {
  return Joi.object().keys({ href: Url() });
};

export const FormatQueryParams = () => {
  return Joi.object().keys({
    format: Joi.string()
      .trim()
      .lowercase()
      .valid(...['raw', 'json'])
      .optional()
      .default('json'),
  });
};

export const PagePageSizeQueryParams = () => {
  return Joi.object().keys({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(25).optional().default(25),
  });
};

export default Object.freeze({
  NanoIdParam,
  FormatQueryParams,
  PagePageSizeQueryParams,
  UuidParam,
  UrlParam,
});
