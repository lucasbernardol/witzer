import type { Hook } from '@hono/zod-validator';

import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';

type HookFunction = Hook<{}, any, any, {}>;

export const zodValidationHook: HookFunction = (result, ctx) => {
	if (!result.success) {
		throw new HTTPException(StatusCodes.BAD_REQUEST, {
			message: result.error.errors[0].message,
			cause: result.error,
		});
	}
};
