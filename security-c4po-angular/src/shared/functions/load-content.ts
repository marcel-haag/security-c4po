import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {distinctUntilChanged, scan} from 'rxjs/operators';
import {calculatePercentage} from '@shared/functions/calculate-percentage';
import {Loading, LoadingState} from '@shared/models/loading.model';

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}

export function loadContent<T>(
  media?: (b: T) => void
): (source: Observable<HttpEvent<T>>) => Observable<Loading<T>> {
  return (source: Observable<HttpEvent<T>>) =>
    source.pipe(
      scan(
        (download: Loading<T>, event): Loading<T> => {
          if (isHttpProgressEvent(event)) {
            return calculatePercentage(download, event);
          }
          if (isHttpResponse(event)) {
            if (media) {
              media(event.body);
            }
            return {
              progress: 100,
              state: LoadingState.DONE,
              content: event.body
            };
          }
          return download;
        },
        {state: LoadingState.PENDING, progress: 0, content: null}
      ),
      distinctUntilChanged((a, b) => a.state === b.state
        && a.progress === b.progress
        && a.content === b.content
      )
    );
}
