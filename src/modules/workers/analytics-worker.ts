import { AnalyticsQueue } from '@modules/queues/analytics-queue';
import { prismaClient } from '@modules/drivers/prismaClient';

const queue = new AnalyticsQueue();

type JobData = {
	shorternerId: string;
	userAgent: string;
};

queue.process<JobData>(async (job) => {
	// Analytis details
	const { userAgent, shorternerId } = job.data;

	await prismaClient.$transaction(async (context) => {
		await context.analytic.create({
			data: {
				userAgent,
				shorternerId,
			},
		});

		await context.shorterner.update({
			where: { id: shorternerId },
			data: {
				redirectings: {
					increment: 1,
				},
			},
		});
	});
});
