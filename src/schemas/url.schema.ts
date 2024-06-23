import isURL from 'validator/lib/isURL';
import { z } from 'zod';

export const url = () => {
	return z
		.string()
		.url()
		.max(2048)
		.trim()
		.refine(
			(value) => {
				return isURL(value, {
					host_blacklist: [
						'localhost',
						'127.0.01',
						process.env.CURRENT_HOST,
						...process.env.BLACKLIST_HOSTS.split(','),
					],
				});
			},
			{ message: 'Invalid host/domain' },
		);
};
