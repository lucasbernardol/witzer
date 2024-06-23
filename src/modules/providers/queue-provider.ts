import { Queue, Processor, Worker } from 'bullmq';

import { redisConnection } from '@modules/redis';

export class QueueProvider {
	private readonly queue: Queue;
	private readonly queueName: string;

	constructor(queueName: string) {
		this.queueName = queueName;
		this.queue = new Queue(this.queueName, {
			connection: redisConnection,

			defaultJobOptions: {
				removeOnComplete: true,
				attempts: 2,
			},
		});
	}

	public async addJob<JobDataType>(jobData: JobDataType) {
		await this.queue.add('message', jobData, {
			delay: 1000 * 3, // 3 seconds to add job to queue
		});
	}

	public process<ProcessDataType>(processFunction: Processor<ProcessDataType>) {
		new Worker(this.queueName, processFunction, {
			connection: redisConnection,
			limiter: {
				max: 2,
				duration: 1000 * 3, // 3 seconds
			},
		})
			.on('completed', (job) => {
				process.stdout.write(
					`${this.queueName} - [${job.name}-${
						job.id || 'UNDEFINED'
					}] - completed\n`,
				);
			})
			.on('active', (job) => {
				process.stdout.write(
					`${this.queueName} - [${job.name}-${
						job.id || 'UNDEFINED'
					}] - active\n`,
				);
			})
			.on('failed', (job) => {
				process.stdout.write(
					`${this.queueName} - [${job?.name || 'NOT_NAMED'}-${
						job?.id || 'UNDEFINED'
					}] - failed - ${job?.failedReason}\n`,
				);
			});
	}
}
