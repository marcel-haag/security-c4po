import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timerDuration',
  pure: false
})
export class TimerDurationPipe implements PipeTransform {

  /**
   * Transforms input time into readable time indication
   * @param time of type number
   * @param args The unit to be used for calculation
   * @returns string in the format `HH:mm:ss`
   */
  transform(time: any, ...args: any[]): string {
    let hours: string | number = 0;
    let minutes: string | number = 0;
    let seconds: string | number = 0;
    if (time) {
      // tslint:disable-next-line:variable-name
      const sec_num = parseInt(time, 10); // don't forget the second param
      hours   = Math.floor(sec_num / 3600);
      minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      seconds = sec_num - (hours * 3600) - (minutes * 60);
    }

    /**
     * Add the relevant `0` prefix if any of the numbers are less than 10
     * i.e. 5 -> 05
     */
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    hours = (hours < 10) ? '0' + hours : hours;
    // Return time in as string in `HH:mm:ss` format
    return `${hours}:${minutes}:${seconds}`;
  }

}
