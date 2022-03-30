export enum Category {
  INFORMATION_GATHERING,
  CONFIGURATION_AND_DEPLOY_MANAGEMENT_TESTING,
  IDENTITY_MANAGEMENT_TESTING,
  AUTHENTICATION_TESTING,
  AUTHORIZATION_TESTING,
  SESSION_MANAGEMENT_TESTING,
  INPUT_VALIDATION_TESTING,
  ERROR_HANDLING,
  CRYPTOGRAPHY,
  BUSINESS_LOGIC_TESTING,
  CLIENT_SIDE_TESTING
}

export class CategoryDetails {
  id: string;
  name: Category;
  disabledPentests: Array<string>;
  disabled: false;
}
