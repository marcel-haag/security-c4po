// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  stage: 'n/a',
  production: false,

  // keycloak
  keycloakURL: 'http://localhost:8080/auth',
  keycloakrealm: 'c4po_realm_local',
  keycloakclientId: 'c4po_local',
  keycloakRedirectUri: 'https://localhost:4200/*',

  // backend service
  apiEndpoint: 'http://localhost:8443',
  reportEndpoint: 'http://localhost:8444'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
