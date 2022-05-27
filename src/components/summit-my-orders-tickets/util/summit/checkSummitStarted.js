export const checkSummitStarted = (summit, now) => {
    if (!summit) return null;

    return summit.start_date < now;
}
