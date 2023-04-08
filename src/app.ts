import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import helmet from 'helmet';
import cors from 'cors';

import limiter from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';

import hpp from 'hpp';

import { HttpError, isHttpError, NotFound, TooManyRequests } from 'http-errors';
import { errors } from 'celebrate';

import { routes } from './routes';

export const app = express();

const globalLimiter = limiter({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 1000,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (request, response, next) => {
    return next(new TooManyRequests());
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.set('trust proxy', 1);

app.use(hpp());
app.use(morgan('dev'));

app.use(globalLimiter);

app.use(routes);
app.use(errors());

app.use((request, response, next) => {
  return next(new NotFound());
});

app.use(
  (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (isHttpError(error)) {
      const { message, status, name } = error as HttpError;

      return response.status(status).json({ name, status, message });
    } else {
      return response.status(500).json({ message: 'Internal Server Error!' });
    }
  }
);
