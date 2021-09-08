import summitData from '../content/summit.json';
import eventsData from '../content/events.json';
import filtersData from '../content/filters.json';

import {getFilteredEvents} from '../utils/schedule';
import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { UPDATE_FILTER, UPDATE_FILTERS, CHANGE_VIEW } from '../actions/schedule-actions'
import { RESET_STATE, SYNC_DATA } from '../actions/base-actions';
import { GET_EVENT_DATA } from '../actions/event-actions';

const {color_source, ...filters} = filtersData;

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

const DEFAULT_STATE = {
  filters: filters,
  colorSource: color_source,
  events: eventsData,
  allEvents: eventsData,
  view: 'calendar'
};

const scheduleReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_STATE:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case SYNC_DATA: {
      const {filters: currentFilters} = state;
      // new filter could have new keys, or less keys that current one .... so its the source of truth
      const newFilters = {...filters};
      const events = getFilteredEvents(eventsData, newFilters, summitTimeZoneId);
      return {...state, allEvents: eventsData, filters: newFilters, colorSource: color_source, events};
    }
    case GET_EVENT_DATA: {
      const {allEvents} = state;
      const event = payload.response || payload.event;
      const index = state.allEvents.findIndex((e) => e.id === event.id);
      const updatedEvents = [...allEvents];

      if (index > 0) {
        updatedEvents[index] = event;
      } else {
        updatedEvents.push(event);
      }
      return { ...state, allEvents: updatedEvents };
    }
    case UPDATE_FILTER: {
      const {type, values} = payload;
      const {filters, allEvents} = state;
      filters[type].values = values;

      // update events
      const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

      return {...state, filters, events}
    }
    case UPDATE_FILTERS: {
      const {filters, view} = payload;
      const {allEvents} = state;


      // update events
      const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

      return {...state, filters, events, view}
    }
    case CHANGE_VIEW: {
      const {view} = payload;
      return {...state, view}
    }
    default:
      return state;
  }
};

export default scheduleReducer
