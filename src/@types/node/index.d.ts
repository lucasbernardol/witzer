declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;

    DATABASE_URL: string;
    SHADOW_DATABASE_URL: string;
    BLACK_LIST_URL: string;
  }
}
