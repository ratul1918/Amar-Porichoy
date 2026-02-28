/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT_MS: string;
  readonly VITE_SESSION_MAX_MS: string;
  readonly VITE_INACTIVITY_TIMEOUT_MS: string;
  readonly VITE_VERBOSE_LOGGING: string;
  readonly VITE_USE_MOCK_API: string;
  readonly VITE_ANALYTICS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
