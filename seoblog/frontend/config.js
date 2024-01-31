import nextConfig from "./next.config";

export const API = nextConfig.publicRuntimeConfig.PRODUCTION 
    ? 'https://seoblog.com/api' 
    : 'http://localhost:8000/api';
export const APP_NAME = nextConfig.publicRuntimeConfig.APP_NAME;
export const DOMAIN = nextConfig.publicRuntimeConfig.PRODUCTION 
    ? nextConfig.publicRuntimeConfig.DOMAIN_PRODUCTION
    : nextConfig.publicRuntimeConfig.DOMAIN_DEVELOPMENT;
export const GOOGLE_CLIENT_ID = nextConfig.publicRuntimeConfig.GOOGLE_CLIENT_ID;
export const GOOGLE_ANALYTICS_ID = nextConfig.publicRuntimeConfig.GOOGLE_ANALYTICS_ID;
export const BLOG_LOAD_LIMIT = 2;
export const COMMENT_LOAD_LIMIT = 3;
export const PRODUCTION = nextConfig.publicRuntimeConfig.PRODUCTION;