import moment from 'moment-timezone'

const groupByDay = (events) => {
  let groupedEvents = [];
  events.forEach((e, index) => {
    const day = moment.unix(e.start_date).format('MM/DD/YYYY');
    groupedEvents[day] = groupedEvents[day] && groupedEvents[day].length > 0 ? [e, ...groupedEvents[day]] : [e];
  });
  return groupedEvents;
};

const sortSchedule = (events) => {
  return events.map((day, index) => {
    return day.sort((a, b) => a.id - b.id);
  })
};

export const sortEvents = (events) => {
  let sortedEvents = groupByDay(events);
  sortedEvents = sortSchedule(sortedEvents);
  return sortedEvents;
};