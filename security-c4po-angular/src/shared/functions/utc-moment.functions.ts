import moment from 'moment-timezone';

export function getUtcMomentFromDate(date: Date): moment.Moment {
  return moment(date).tz('Etc/UTC');
}
