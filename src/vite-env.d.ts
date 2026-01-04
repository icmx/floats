 interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

 interface ImportMetaEnv {
  readonly BUNDLE_API_BASE_URL: string;
  readonly BUNDLE_API_PIVOT_CURRENCY: string;
}

 interface ImportMeta {
  readonly env: ImportMetaEnv;
}
