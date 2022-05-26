import { getDaysBetweenDates, getFormattedDate } from "../helpers";

export const getSummitFormattedDate = (summit) => {
    if (!summit) return null;

    let dateRange = getDaysBetweenDates(summit.start_date, summit.end_date, summit.time_zone_id);

    if (dateRange.length > 1) {
        let startDate = getFormattedDate(dateRange[0], summit.time_zone_id);
        let endDate = getFormattedDate(dateRange[dateRange.length - 1], summit.time_zone_id);

        const startMonth = startDate.split(' ')[0];
        const endMonth = endDate.split(' ')[0];

        if (startMonth === endMonth) endDate = endDate.substr(endDate.indexOf(" ") + 1);

        const startYear = startDate.substring(startDate.length, startDate.length - 4);
        const endYear = endDate.substring(endDate.length, endDate.length - 4);

        if (startYear === endYear) startDate = startDate.substring(0, startDate.length - 6);

        endDate = endDate.substring(0, endDate.length - 6) + ', ' + endDate.substring(endDate.length - 4);

        return `${startDate} - ${endDate}`;
    }

    return getFormattedDate(summit.start_date, summit.time_zone_id);

};
