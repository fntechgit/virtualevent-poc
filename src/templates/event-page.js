import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import envVariables from '../utils/envVariables';
import SummitObject from '../content/summit.json'

import Layout from '../components/Layout'

import DisqusComponent from '../components/DisqusComponent'
import Etherpad from '../components/Etherpad'
import SimpleChatWidgetComponent from '../components/SimpleChatWidgetComponent'
import VideoComponent from '../components/VideoComponent'
import TalkComponent from '../components/TalkComponent'
import DocumentsComponent from '../components/DocumentsComponent'
import EventHeroComponent from '../components/EventHeroComponent'
import HeroComponent from '../components/HeroComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'

import { getEventBySlug } from '../actions/event-actions'
import { getDisqusSSO } from '../actions/user-actions'

import { PHASES } from '../utils/phasesUtils';

import { AttendanceTracker } from "openstack-uicore-foundation/lib/components";

export const EventPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);
    this.onEventChange = this.onEventChange.bind(this);
    this.onViewAllEventsClick = this.onViewAllEventsClick.bind(this);
  }

  componentWillMount() {
    const { eventId } = this.props;
    this.props.getEventBySlug(eventId);
    this.props.getDisqusSSO();
  }

  onEventChange(ev) {
    this.props.getEventBySlug(ev.id);
    navigate(`/a/event/${ev.id}`);
  }

  onViewAllEventsClick() {
    navigate('/a/schedule')
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.loading !== nextProps.loading) return true;
    if (this.props.eventId !== nextProps.eventId) return true;
    if (this.props.event?.id !== nextProps.event?.id) return true;
    if (this.props.eventsPhases !== nextProps.eventsPhases) return true;
    return false
  }

  render() {
    const { loggedUser, event, eventsPhases, user, loading } = this.props;
    let { summit } = SummitObject;
    let currentEvent = eventsPhases.find(e => e.id === event.id);
    let eventStarted = currentEvent && currentEvent.phase !== null ? currentEvent.phase : -1;

    if (loading) {
      return <HeroComponent title="Loading event" />
    } else {
      if (event) {
        return (
          <>
            {/* <EventHeroComponent /> */}
            {event.id &&
              <AttendanceTracker
                key={event.id}
                eventId={event.id}
                summitId={summit.id}
                apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
                accessToken={loggedUser.accessToken}
              />
            }
            <section className="section px-0 py-0" style={{ marginBottom: event.class_name !== 'Presentation' || eventStarted < PHASES.DURING || !event.streaming_url ? '-3rem' : '' }}>
              <div className="columns is-gapless">
                {eventStarted >= PHASES.DURING && event.streaming_url ?
                  <div className="column is-three-quarters px-0 py-0">
                    <VideoComponent url={event.streaming_url} />
                    {event.meeting_url &&
                      <div className="join-zoom-container">
                        <span>
                          Take the virtual mic and participate!
                        </span>
                        <a className="zoom-link" href={event.meeting_url} target="_blank">
                          <button className="zoom-button button">
                            <b>Join now</b>
                          </button>
                        </a>
                        <a target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        </a>
                      </div>
                    }
                  </div>
                  :
                  <div className="column is-three-quarters px-0 py-0 is-hidden-mobile">
                    <TalkComponent eventStarted={eventStarted} event={event} summit={summit} noStream={true} />
                  </div>
                }
                <div className="column is-hidden-tablet">
                  <TalkComponent eventStarted={eventStarted} event={event} summit={summit} noStream={true} />
                </div>
                <div className="column" style={{ position: 'relative', borderBottom: '1px solid #d3d3d3' }}>
                  <DisqusComponent disqusSSO={user.disqusSSO} event={event} summit={summit} title="Public Conversation" />
                </div>
              </div>
            </section>
            {eventStarted >= PHASES.DURING && event.streaming_url &&
              <section className="section px-0 pt-5 pb-0">
                <div className="columns mx-0 my-0 is-multiline">
                  <div className="column px-0 py-0 is-three-quarters is-hidden-mobile">
                    <TalkComponent eventStarted={eventStarted} event={event} summit={summit} noStream={true} />
                  </div>
                  <DocumentsComponent event={event} />
                  {event.etherpad_link &&
                    <div className="column is-three-quarters">
                      <Etherpad className="talk__etherpad" etherpad_link={event.etherpad_link} userName={user.userProfile.first_name} />
                    </div>
                  }
                  <div className="column is-one-quarter" style={{ marginLeft: 'auto' }}>
                    <SimpleChatWidgetComponent accessToken={loggedUser.accessToken} />
                  </div>
                  <div className="column is-three-quarters">
                    <ScheduleLiteComponent
                      accessToken={loggedUser.accessToken}
                      onEventClick={(ev) => this.onEventChange(ev)}
                      onViewAllEventsClick={() => this.onViewAllEventsClick()}
                      landscape={true}
                      yourSchedule={false}
                      showFilters={false}
                      showNav={false}
                      trackId={event.track ? event.track.id : null}
                      eventCount={3}
                      title={event.track ? `Up Next on ${event.track.name}` : 'Up Next'}
                    />
                    {/* <ScheduleLiteComponent
                      accessToken={loggedUser.accessToken}
                      onEventClick={(ev) => this.onEventChange(ev)}
                      onViewAllEventsClick={() => this.onViewAllEventsClick()}
                      landscape={true}
                      showNav={true}
                      showFilters={true}
                      showAllEvents={true}
                      eventCount={100}
                      title={event.track ? `Up Next on ${event.track.name}` : 'Up Next'}
                    /> */}
                  </div>
                </div>
              </section>
            }
          </>
        )
      } else {
        return <HeroComponent title="Loading event" />
      }
    }
  }
}

const EventPage = (
  {
    loggedUser,
    loading,
    event,
    eventId,
    user,
    eventsPhases,
    getEventBySlug,
    getDisqusSSO
  }
) => {

  return (
    <Layout>
      <EventPageTemplate
        loggedUser={loggedUser}
        event={event}
        loading={loading}
        eventId={eventId}
        user={user}
        eventsPhases={eventsPhases}
        getEventBySlug={getEventBySlug}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

EventPage.propTypes = {
  loggedUser: PropTypes.object,
  loading: PropTypes.bool,
  event: PropTypes.object,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventBySlug: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

EventPageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  event: PropTypes.object,
  loading: PropTypes.bool,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventBySlug: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = (
  {
    loggedUserState,
    eventState,
    userState,
    clockState,
  }
) => ({

  loggedUser: loggedUserState,
  loading: eventState.loading,
  event: eventState.event,
  eventsPhases: clockState.events_phases,
  user: userState,
})

export default connect(
  mapStateToProps,
  {
    getEventBySlug,
    getDisqusSSO
  }
)(EventPage);