import nextConfig from "./next.config";

export const API = nextConfig.publicRuntimeConfig.PRODUCTION ? 'https://seoblog.com' : 'http://localhost:8000';
export const APP_NAME = nextConfig.publicRuntimeConfig.APP_NAME;