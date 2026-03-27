interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_HMR_HOST?: string;
  readonly VITE_HMR_CLIENT_PORT?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
