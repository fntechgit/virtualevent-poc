import moment from "moment-timezone";

export const getDaysBetweenDates = (startDate, endDate, timeZone) => {
    let startDay = moment(startDate * 1000).tz(timeZone)
    let endDay = moment(endDate * 1000).tz(timeZone)

    // Add day one
    let dates = [startDay.clone().unix()]

    // Add all additional days
    while (startDay.add(1, 'days').diff(endDay) < 0) {
        dates.push(startDay.clone().unix())
    }

    return dates
};