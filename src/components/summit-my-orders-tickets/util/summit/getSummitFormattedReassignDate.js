import { getFormattedDate } from "../helpers/getFormattedDate";
import { getSummitReassignDate } from "./getSummitReassignDate";

export const getSummitFormattedReassignDate = (summit) => {
    const reassignDate = getSummitReassignDate(summit);

    return getFormattedDate(reassignDate, summit.time_zone_id);
};