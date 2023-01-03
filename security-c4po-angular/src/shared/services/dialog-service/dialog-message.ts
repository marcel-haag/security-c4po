export interface DialogMessage {
  key: string;
  data?: any;
  title?: string;
  inputPlaceholderKey?: string;
}

export interface SecurityDialogMessage {
  key: string;
  confirmString: string;
  data?: any;
  title?: string;
  inputPlaceholderKey?: string;
}
