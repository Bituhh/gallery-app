// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APP_REST_API_ENDPOINT: import.meta.env.APP_REST_API_ENDPOINT,
  AWS_REGION: import.meta.env.AWS_REGION,
  AWS_RESOURCES_BUCKET: import.meta.env.AWS_RESOURCES_BUCKET,
  AWS_IDENTITY_POOL_ID: import.meta.env.AWS_IDENTITY_POOL_ID,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
