import nextConfig from "./next.config";

export const API = nextConfig.publicRuntimeConfig.PRODUCTION ? 'https://seoblog.com/api' : 'http://localhost:8000/api';
export const APP_NAME = nextConfig.publicRuntimeConfig.APP_NAME;