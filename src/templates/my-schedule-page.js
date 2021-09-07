import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import {
  updateFiltersFromHash,
  updateFilter,
  getShareLink, MY_SCHEDULE_UPDATE_FILTER, MY_SCHEDULE_UPDATE_FILTERS,
} from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";

import { PHASES } from "../utils/phasesUtils";
import styles from "../styles/full-schedule.module.scss";

const MySchedulePage = ({
  summit,
  summitPhase,
  isLoggedUser,
  location,
  events,
  allEvents,
  filters,
  view,
  colorSource,
  colorSettings,
  updateFilter,
  updateFiltersFromHash,
}) => {
  const [showFilters, setShowfilters] = useState(false);

  const filterProps = {
    summit,
    events,
    allEvents,
    filters: pickBy(filters, (value) => value.enabled),
    triggerAction: (action, payload) => {
      updateFilter(payload, MY_SCHEDULE_UPDATE_FILTER);
    },
    marketingSettings: colorSettings,
    colorSource: colorSource,
  };

  let scheduleProps = {
    summit,
    events,
    filters,
    view,
    colorSource,
    getShareLink: () => getShareLink(filters, view),
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      onStartChat: console.log,
    };
  }

  useEffect(() => {
    updateFiltersFromHash(filters, MY_SCHEDULE_UPDATE_FILTERS);
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
          <button className={styles.filterButton} onClick={() => setShowfilters(!showFilters)}>
            <i className="fa fa-filter" />
            Filters
          </button>
        </div>
      </div>
      <AttendanceTrackerComponent />
    </Layout>
  );
};

MySchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({
  summitState,
  clockState,
  loggedUserState,
  myScheduleState,
  settingState,
}) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  events: myScheduleState.events,
  allEvents: myScheduleState.allEvents,
  filters: myScheduleState.filters,
  view: myScheduleState.view,
  colorSource: myScheduleState.colorSource,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
})(MySchedulePage);
