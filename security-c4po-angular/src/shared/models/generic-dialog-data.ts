export interface GenericDialogData {
  form: {
    [key: string]: GenericFormFieldConfig // key is property name, e.g. title
  };
  options?: GenericFormFieldOption[];
}

export interface GenericFormFieldConfig {
  fieldName: string;
  type: string; // text, password, email
  labelKey: string; // translation key of field label
  placeholder: string; // translation key of placeholder text
  controlsConfig: { [key: string]: any };
  errors: GenericFormFieldError[];
}

export interface GenericFormFieldError {
  errorCode: string;
  translationKey: string;
}

export interface GenericFormFieldOption {
  headerLabelKey: string;
  buttonKey: string;
  accentColor: string;
}
