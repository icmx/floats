declare const __DEFINE_COMMIT_REF__: string;

declare const __DEFINE_BUILD_TIMESTAMP__: number;

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly BUNDLE_API_BASE_URL: string;
  readonly COMMIT_REF: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
