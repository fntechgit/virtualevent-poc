import React, { useEffect } from "react"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import { isAuthorizedBadge } from '../utils/authorizedGroups';
import { PHASES } from '../utils/phasesUtils'
import { getUserProfile, requireExtraQuestions } from "../actions/user-actions";
import HeroComponent from '../components/HeroComponent'


const PrivateRoute = ({
                        component: Component,
                        isLoggedIn,
                        location,
                        eventId,
                        user: { loading, userProfile, hasTicket, isAuthorized },
                        summit_phase,
                        getUserProfile,
                        requireExtraQuestions,
                        ...rest }) => {


  useEffect(() => {

    if (!isLoggedIn) return;

    if (!userProfile) {
      // get user profile
      getUserProfile();
      return;
    }

  }, [userProfile, getUserProfile ]);

  if (!isLoggedIn) {
    navigate('/', {
      state: {
        backUrl: `${location.pathname}`
      }
    })
    return null
  }

  const userIsAuthz = () => {
    return (hasTicket || isAuthorized)
  }

  const userIsReady = () => {
    return userProfile && userIsAuthz();
  }

  if (loading || !userIsReady()) {
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }

  if (requireExtraQuestions()) {
    // of we already on extra questions page just render the component
    if (location.pathname === "/a/extra-questions") {
      return (<Component location={location} eventId={eventId} {...rest} />);
    }

    return (
        <HeroComponent
          title="You need to complete some extra questions before entering the event"
          redirectTo="/a/extra-questions"
        />
      );
  }

  if (!userIsAuthz() &&  location.pathname !== "/a/extra-questions") {
    navigate('/authz/ticket', {
      state: {
        error: 'no-ticket'
      }
    })
    return null
  }

  if (!userIsAuthz() && summit_phase === PHASES.BEFORE) {
    return (
      <HeroComponent
        title="Its not yet show time!"
        redirectTo="/"
      />
    )
  }

  // if we are at an activity page ...
  if (eventId && userIsReady() && !isAuthorizedBadge(eventId, userProfile.summit_tickets)) {
    setTimeout(() => {
      navigate(location.state?.previousUrl ? location.state.previousUrl : '/')
    }, 3000);
    return (
      <HeroComponent
        title="You are not authorized to view this session!"
      />
    )
  }

  return (<Component location={location} eventId={eventId} {...rest} />);
}

export default connect(null, {
  getUserProfile,
  requireExtraQuestions
})(PrivateRoute)