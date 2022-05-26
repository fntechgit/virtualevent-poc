export const getDayNumberFromDate = (days, date) => {
    let dayNumber

    days.find((d, index) => {
        if (d == date) dayNumber = index + 1;
    });

    return dayNumber;
};