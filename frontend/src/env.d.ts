/* eslint-disable @typescript-eslint/naming-convention */

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  [key: string]: string;

  readonly NG_APP_ENV: string;

  // Add your environment variables below
  readonly APP_REST_API_ENDPOINT: string;
  readonly AWS_RESOURCES_BUCKET: string;
  readonly AWS_REGION: string;
  readonly AWS_IDENTITY_POOL_ID: string;
}
