 interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

 interface ImportMetaEnv {
  readonly BUNDLE_API_BASE_URL: string;
}

 interface ImportMeta {
  readonly env: ImportMetaEnv;
}
