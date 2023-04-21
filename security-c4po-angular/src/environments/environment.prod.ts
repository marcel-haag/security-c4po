export const environment = {
  production: true,

  // keycloak
  keycloakURL: 'http://localhost:8080/auth',
  keycloakrealm: 'c4po_realm_local',
  keycloakclientId: 'c4po_local',
  keycloakRedirectUri: 'https://localhost:4200/*',

  // backend service
  apiEndpoint: 'http://localhost:8443',
  reportEndpoint: 'http://localhost:8444'
};
