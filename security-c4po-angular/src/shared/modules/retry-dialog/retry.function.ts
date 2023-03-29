import {untilDestroyed} from '@ngneat/until-destroy';

// ToDo: PoC for handling failed requests
function onRequestFailed(retryParameter: any): void {
  this.dialogService.openRetryDialog({key: 'global.retry.dialog', data: null}).onClose
    .pipe(
      untilDestroyed(this)
    )
    .subscribe((ref) => {
      console.warn(ref);
      if (ref.retry) {
        // ToDo: Send same request again
        console.warn('Retry');
        this.METHODTHATNEEDSTOBEEXECUTED(retryParameter);
      } else {
        // ToDo: Cancel action
        console.warn('Cancel');
      }
    });
}
