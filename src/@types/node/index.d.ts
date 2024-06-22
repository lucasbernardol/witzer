declare namespace NodeJS {
	export interface ProcessEnv {
		PORT:string;
		HOST: string;

		CURRENT_HOST: string;
		BLACKLIST_HOSTS: string;

		REDIS_URL: string;
	}
}
