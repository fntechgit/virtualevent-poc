import moment from "moment-timezone";

export const getFormattedDate = (datetime, timeZone) => {
    if (timeZone) return moment.tz(datetime * 1000, timeZone).format('MMMM DD, YYYY')

    return moment.unix(datetime).format('MMMM DD, YYYY')
}