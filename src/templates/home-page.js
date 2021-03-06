import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import withOrchestra from "../utils/widgetOrchestra";

import SummitObject from '../content/summit.json'
import HomeSettings from '../content/home-settings.json'

import LobbyHeroComponent from '../components/LobbyHeroComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import DisqusComponent from '../components/DisqusComponent'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import SpeakersWidgetComponent from '../components/SpeakersWidgetComponent'
import SponsorComponent from '../components/SponsorComponent'
import SimpleChatWidgetComponent from '../components/SimpleChatWidgetComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import { getDisqusSSO, getUserProfile } from '../actions/user-actions'

import { envVariables } from "../utils/envVariables";

export const HomePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);
    this.onEventChange = this.onEventChange.bind(this);
  }

  componentDidMount() {
    this.props.getDisqusSSO();
  }

  onEventChange(ev) {
    navigate(`/a/event/${ev.id}`);
  }

  onViewAllEventsClick() {
    navigate('/a/schedule')
  }

  onViewAllMyEventsClick() {
    navigate('/a/my-schedule')
  }

  render() {
    const { user, addWidgetRef, updateWidgets } = this.props;
    let { summit } = SummitObject;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <h2><b>Community</b></h2>
              <SponsorComponent page='lobby'/>
              <AdvertiseComponent section='lobby' column="left" />
            </div>
            <div className="column is-half">
              <h2><b>Today</b></h2>
              <LiveEventWidgetComponent
                featuredEventId={HomeSettings.live_now_featured_event_id}
                onEventClick={(ev) => this.onEventChange(ev)}
                style={{marginBottom: '15px'}}
              />
              <DisqusComponent
                page="lobby"
                disqusSSO={user.disqusSSO}
                summit={summit}
                className="disqus-container-home"
                title="Public conversation"
              />
              <ScheduleLiteComponent
                onEventClick={(ev) => this.onEventChange(ev)}
                onViewAllEventsClick={() => this.onViewAllEventsClick()}
                landscape={false}
                yourSchedule={false}
                showNav={false}
                showAllEvents={true}
                onRef={addWidgetRef}
                updateCallback={updateWidgets}
                title="Up Next"
                eventCount={4}
                />
              {HomeSettings.centerColumn.speakers.showTodaySpeakers &&
                <SpeakersWidgetComponent
                  title="Today's Speakers"
                  bigPics={true}
                />
              }
              {HomeSettings.centerColumn.speakers.showFeatureSpeakers &&
                <SpeakersWidgetComponent
                  title="Featured Speakers"
                  bigPics={false}
                  featured={true}
                  date={null}
                />
              }
              <AdvertiseComponent section='lobby' column="center" />
            </div>
            <div className="column is-one-quarter pb-6">
              <h2><b>My Info</b></h2>
              <SimpleChatWidgetComponent title="Private Chat" />
              <ScheduleLiteComponent
                onEventClick={(ev) => this.onEventChange(ev)}
                onViewAllEventsClick={() => this.onViewAllMyEventsClick()}
                title='My Schedule'
                landscape={true}
                yourSchedule={true}
                showNav={true}
                eventCount={10}
                slotCount={1}
                onRef={addWidgetRef}
                updateCallback={updateWidgets}
              />
              <AdvertiseComponent section='lobby' column="right" />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

const OrchestedTemplate = withOrchestra(HomePageTemplate);

const HomePage = (
  {
    location,
    user,
    getUserProfile,
    getDisqusSSO
  }
) => {  
  return (
    <Layout location={location}>
      <AttendanceTrackerComponent sourceName="LOBBY" />
      <OrchestedTemplate
        user={user}
        getUserProfile={getUserProfile}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

HomePage.propTypes = {
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

HomePageTemplate.propTypes = {
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = ({ userState }) => ({
  user: userState,
})

export default connect(mapStateToProps, { getDisqusSSO, getUserProfile } )(HomePage);