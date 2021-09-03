import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { navigate } from "gatsby";
import { getUserProfile, requireExtraQuestions } from "../actions/user-actions";
import HeroComponent from "../components/HeroComponent";

const WithAuthRoute = ({
  children,
  isLoggedIn,
  location,
  userProfile,
  hasTicket,
  isAuthorized,
  getUserProfile,
}) => {
  const [fetchedUserProfile, setFetchedUserProfile] = useState(false);

  const userIsReady = () => {
    // we have an user profile
    return !!userProfile;
  };

  const userIsAuthz = () => {
    return hasTicket || isAuthorized;
  };

  const checkingCredentials = () => {
    return !userIsAuthz() && !fetchedUserProfile;
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!userProfile) {
      getUserProfile();
      return;
    }
    // if the user is not authz and we accessing a private route , get fresh data to recheck
    // authz condition ( new tickets / new groups ) after every render of the route
    if (!fetchedUserProfile && !userIsAuthz()) {
      setFetchedUserProfile(true);
      getUserProfile();
    }
  }, [fetchedUserProfile, isLoggedIn, hasTicket, isAuthorized, userProfile]);

  if (!isLoggedIn) {
    navigate("/", {
      state: {
        backUrl: `${location.pathname}`,
      },
    });
    return null;
  }

  // we are checking credentials if userProfile is being loading yet or
  // if we are refetching the user profile to check new data ( user currently is not a authz
  if (!userIsReady() || checkingCredentials()) {
    return <HeroComponent title="Checking credentials..." />;
  }

  // if we have the user profile but has no tickets for the show
  if (!userIsAuthz() && userIsReady()) {
    setTimeout(() => { navigate(location.state?.previousUrl || "/") }, 3000);
    return (<HeroComponent title="You are not authorized to view this session!" />);
  }

  return children;
};

const mapStateToProps = ({ userState }) => ({
  userProfile: userState.userProfile,
  isAuthorized: userState.isAuthorized,
  hasTicket: userState.hasTicket,
});

export default connect(mapStateToProps, {
  getUserProfile,
  requireExtraQuestions,
})(WithAuthRoute);
