export interface EnvConfig {
  env: string;
  baseUrl: string;
  apiBaseUrl: string;
  ui: {
    username: string;
    password: string;
  };
  api: {
    username: string;
    password: string;
  };
}

export const config: EnvConfig = {
  env: process.env.ENV ?? 'dev',
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://dummyjson.com',
  ui: {
    username: process.env.UI_USERNAME ?? 'standard_user',
    password: process.env.UI_PASSWORD ?? 'secret_sauce',
  },
  api: {
    username: process.env.API_USERNAME ?? 'emilys',
    password: process.env.API_PASSWORD ?? 'emilyspass',
  },
};
