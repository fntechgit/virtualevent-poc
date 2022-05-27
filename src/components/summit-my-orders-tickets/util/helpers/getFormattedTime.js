import moment from "moment-timezone";

export const getFormattedTime = (datetime, timeZone = false) => {
    if (timeZone) {
        return moment.tz(datetime * 1000, timeZone).format('HH:mm')
    }

    return moment.unix(datetime).format('HH:mm')
}
