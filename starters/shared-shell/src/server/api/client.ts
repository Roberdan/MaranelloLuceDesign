export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export function createApiClientConfig(config: ApiClientConfig): ApiClientConfig {
  return {
    baseUrl: config.baseUrl,
    headers: { ...(config.headers || {}) },
  };
}
