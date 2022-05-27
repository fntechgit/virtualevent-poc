export const getSummitLocation = (summit) => {
    if (!summit) return null;

    let location = summit.locations.find(l => l.class_name === 'SummitVenue' && l.is_main === true);

    if (!location) return null;

    return `${location.city}, ${location.country}`;
};