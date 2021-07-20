import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import LiteScheduleComponent from '../components/LiteScheduleComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import { PHASES } from '../utils/phasesUtils'

const MySchedulePage = ({ summitPhase, isLoggedUser, location }) => {

  let scheduleProps = {showSearch: true, showAllEvents: true, yourSchedule: true, showDetails: true};

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
    }
  }

  return (
    <Layout location={location}>
      <div className="container">
        <h1>My Schedule</h1>
        <hr />
        <LiteScheduleComponent {...scheduleProps} />
      </div>
      <AttendanceTrackerComponent />
    </Layout>
  )
};

MySchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({ clockState, loggedUserState }) => ({
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser
});

export default connect(
  mapStateToProps, {}
)(MySchedulePage);