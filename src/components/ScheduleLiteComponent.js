import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite/dist';
import 'schedule-lite/dist/index.css';

const ScheduleComponent = class extends React.Component {

  render() {

    const scheduleProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: parseInt(envVariables.SUMMIT_ID),
      updateCallback: ev => console.log('event updated', ev),
      onEventClick: ev => this.props.onEventClick(ev),
      onAuthError: (err, res) => expiredToken(err),
      onRef: ref => this.child = ref,
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <ScheduleLite {...scheduleProps} {...this.props} />
        </div>
      </React.Fragment>
    )
  }
}

export default ScheduleComponent