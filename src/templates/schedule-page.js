import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import { updateFiltersFromHash, updateFilter } from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import AccessTracker from "../components/AttendeeToAttendeeWidgetComponent";
import { PHASES } from "../utils/phasesUtils";
import FilterButton from "../components/FilterButton";

import styles from "../styles/full-schedule.module.scss";


const SchedulePage = ({
  summit,
  summitPhase,
  isLoggedUser,
  location,
  events,
  allScheduleEvents,
  filters,
  view,
  timezone,
  colorSource,
  colorSettings,
  updateFilter,
  updateFiltersFromHash,
}) => {
  const [showFilters, setShowfilters] = useState(false);

  const filterProps = {
    summit,
    events,
    allEvents: allScheduleEvents,
    filters: pickBy(filters, (value) => value.enabled),
    triggerAction: (action, payload) => {
      updateFilter(payload);
    },
    marketingSettings: colorSettings,
    colorSource: colorSource,
  };

  let scheduleProps = {
    summit,
    events,
    filters,
    view,
    timezone,
    colorSource,
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`, { state: { previousUrl: location.pathname }}),
      onStartChat: null,
    };
  }

  useEffect(() => {
    updateFiltersFromHash(filters, view);
  });

  if (!summit) return null;

  return (
    <Layout location={location}>
      <div className="container">
        <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ""}`}>
          <div className={styles.scheduleWrapper}>
            <FullSchedule {...scheduleProps} />
          </div>
          <div className={styles.filterWrapper}>
            <ScheduleFilters {...filterProps} />
          </div>
          <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)} />
        </div>
      </div>
      <AttendanceTrackerComponent />
      <AccessTracker />
    </Layout>
  );
};

SchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({
  summitState,
  clockState,
  loggedUserState,
  scheduleState,
  settingState,
}) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  events: scheduleState.events,
  allScheduleEvents: scheduleState.allScheduleEvents,
  filters: scheduleState.filters,
  view: scheduleState.view,
  timezone: scheduleState.timezone,
  colorSource: scheduleState.colorSource,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
})(SchedulePage);
