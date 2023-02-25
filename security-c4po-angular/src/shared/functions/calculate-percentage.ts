import {Loading, LoadingState} from '@shared/models/loading.model';

export function calculatePercentage<T>(download: Loading<T>, event): Loading<T> {
  return {
    progress: event.total
      ? Math.round((100 * event.loaded) / event.total)
      : download.progress,
    state: LoadingState.IN_PROGRESS,
    content: null
  };
}
