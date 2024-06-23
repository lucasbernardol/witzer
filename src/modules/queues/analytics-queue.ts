import { QueueProvider } from '@modules/providers/queue-provider';

export class AnalyticsQueue extends QueueProvider {
	constructor() {
		super('analytics-queue');
	}
}
