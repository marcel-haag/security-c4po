export class Loading<T = any> {
  content?: T | null;
  progress: number;
  state: LoadingState;
}

export enum LoadingState {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
