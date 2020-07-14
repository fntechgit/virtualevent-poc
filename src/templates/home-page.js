import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'

import LobbyHeroComponent from '../components/LobbyHeroComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import DisqusComponent from '../components/DisqusComponent'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import SpeakersWidgetComponent from '../components/SpeakersWidgetComponent'

import { getSummitData } from '../actions/summit-actions'
import { getDisqusSSO } from '../actions/user-actions'

export const HomePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.onEventChange = this.onEventChange.bind(this);
  }

  componentWillMount() {
    const { loggedUser } = this.props;
    if (!loggedUser.isLoggedUser) {
      navigate('/a/login');
    }
    this.props.getSummitData();
  }

  componentDidMount() {
    this.props.getDisqusSSO();
  }

  onEventChange(ev) {
    navigate(`/a/event/${ev}`);
  }

  render() {

    const { loggedUser, user, summit } = this.props;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <h2><b>Community</b></h2>
              <AdvertiseComponent section='lobby' column="left"/>
            </div>            
            <div className="column is-half">
            <LiveEventWidgetComponent />
              <DisqusComponent disqusSSO={user.disqusSSO} summit={summit} style={{ position: 'static' }} />
              <ScheduleLiteComponent
                accessToken={loggedUser.accessToken}
                eventClick={(ev) => this.onEventChange(ev)}
                landscape={false}
                yourSchedule={false}
                showNav={false}                                          
              />
              <SpeakersWidgetComponent
                accessToken={loggedUser.accessToken}
                title="Today's Speakers"
              />
              <AdvertiseComponent section='lobby' column="center"/>
            </div>
            <div className="column is-one-quarter pb-6">
              <h2><b>My Info</b></h2>
              <ScheduleLiteComponent
                accessToken={loggedUser.accessToken}
                eventClick={(ev) => this.onEventChange(ev)}
                landscape={true}
                yourSchedule={true}                
                showNav={true}
              />
              <AdvertiseComponent section='lobby' column="right"/>
            </div>
          </div>
        </div>
        {/* <ClockComponent summit={summit} now={now} /> */}
      </React.Fragment>
    )
  }
}

HomePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  summit: PropTypes.object,
  user: PropTypes.object,
  eventId: PropTypes.string,
  getSummitData: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const HomePage = ({ loggedUser, user, location, summit, getSummitData, getDisqusSSO }) => {

  return (
    <Layout>
      <HomePageTemplate
        loggedUser={loggedUser}
        location={location}
        user={user}
        summit={summit}
        getSummitData={getSummitData}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )

}

HomePage.propTypes = {
  summit: PropTypes.object,
  loggedUser: PropTypes.object,
  location: PropTypes.object,
}

const mapStateToProps = ({ loggedUserState, userState, summitState }) => ({
  loggedUser: loggedUserState,
  user: userState,
  summit: summitState.summit,
})

export default connect(mapStateToProps,
  {
    getSummitData,
    getDisqusSSO
  }
)(HomePage);
