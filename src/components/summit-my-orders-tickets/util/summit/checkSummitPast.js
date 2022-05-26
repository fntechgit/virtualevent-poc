export const checkSummitPast = (summit, now) => {
    if (!summit) return null;

    const reassign_date =
        summit?.reassign_ticket_till_date && summit.reassign_ticket_till_date < summit.end_date
            ? summit.reassign_ticket_till_date
            : summit.end_date;

    return now > reassign_date ? true : false;
}