import { z, ZodString } from 'zod';
import { NANOID_DEFAULT_SIZE } from '@utils/nanoid.util';

export const nanoid = (): ZodString => {
	return z.string().trim().min(NANOID_DEFAULT_SIZE).max(NANOID_DEFAULT_SIZE);
};
