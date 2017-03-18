import moment from 'moment';

export function format(string) {
    return moment(string).format('DD.MM.YYYY HH:mm:ss');
}
