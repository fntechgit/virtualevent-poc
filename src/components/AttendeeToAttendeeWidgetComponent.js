import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
// import SummitData from "../content/summit.json";
// import EventsData from "../content/events.json";
import { AttendeeToAttendeeContainer, Tracker } from "attendee-to-attendee-widget";
import {
  getEnvVariable,
  CHAT_API_BASE_URL,
  IDP_BASE_URL,
  STREAM_IO_API_KEY,
  STREAM_IO_SSO_SLUG,
  SUMMIT_ID,
  SUPABASE_URL,
  SUPABASE_KEY,
} from "../utils/envVariables";
import withAccessToken from "../utils/withAccessToken";

import "attendee-to-attendee-widget/dist/index.css";

const sbAuthProps = {
  supabaseUrl: getEnvVariable(SUPABASE_URL),
  supabaseKey: getEnvVariable(SUPABASE_KEY),
};

const chatProps = {
  streamApiKey: getEnvVariable(STREAM_IO_API_KEY),
  apiBaseUrl: getEnvVariable(IDP_BASE_URL),
  chatApiBaseUrl: getEnvVariable(CHAT_API_BASE_URL),
  forumSlug: getEnvVariable(STREAM_IO_SSO_SLUG),
  onAuthError: (err, res) => console.log(err),
  openDir: "left",
  getAccessToken: async () => {},  
  activity: {
    id: 206,
    name:
      'Global Collaboration Driving Innovation in a Multi-Billion Dollar Market', //Widget will create this activity room or add members to it
    imgUrl: 'https://www.gravatar.com/avatar/ed3aa6518abef1c091b9a891b8f43e83'
  }
};

export const AttendeesWidget = withAccessToken(({ user, accessToken }) => {
  //const [accessInfo, setAccessInfo] = useState({});
  // const chatRef = useRef()

  const { email, first_name, last_name, bio } = user.userProfile;
  const { picture, company, job_title, sub, github_user, linked_in_profile, twitter_name, wechat_user } = user.idpProfile;

  const getAccessToken = async () =>  accessToken;

  chatProps.getAccessToken = getAccessToken;

  const widgetProps = {
    user: {
      id: sub.toString(),
      idpUserId: sub.toString(),
      fullName: `${first_name} ${last_name}`,
      email: email,
      groups: ['admins'],
      company: company,
      title: job_title,
      picUrl: picture,
      socialInfo: {
        githubUser: github_user,
        linkedInProfile: linked_in_profile,
        twitterName: twitter_name,
        wechatUser: wechat_user,
      },
      badgeFeatures: ["feat 1", "feat 2"], //attendee.ticket.badge.features
      bio: bio,
      canChat: true, //based on badge features
    },
    summitId: parseInt(getEnvVariable(SUMMIT_ID)),
    height: 400,
    ...chatProps,
    ...sbAuthProps,
  };

  // console.log("SummitData", SummitData);
  // console.log("EventsData", EventsData);

  console.log("AttendeesList user", user);
  console.log("idpUserId", sub.toString());
  console.log("AttendeesList accessToken", accessToken);

  return (
    <div style={{ margin: "20px auto", position: "relative" }}>
      {/* {accessToken && <SimpleChat {...widgetProps} accessToken={accessToken} ref={chatRef} />} */}
      <AttendeeToAttendeeContainer {...widgetProps} getAccessToken={getAccessToken} />
    </div>
  );
});

const AccessTracker = ({ user, isLoggedUser }) => {
  const trackerRef = useRef();

  const { email, first_name, last_name, bio } = user.userProfile;
  const { picture, company, job_title, sub, github_user, linked_in_profile, twitter_name, wechat_user } = user.idpProfile;
  const widgetProps = {
    user: {
      fullName: `${first_name} ${last_name}`,
      email: email,
      company: company,
      title: job_title,
      picUrl: picture,
      idpUserId: sub,
      socialInfo: {
        githubUser: github_user,
        linkedInProfile: linked_in_profile,
        twitterName: twitter_name,
        wechatUser: wechat_user,
      },
      badgeFeatures: ["feat 1", "feat 2"], //attendee.ticket.badge.features
      bio: bio,
    },
    summitId: parseInt(getEnvVariable(SUMMIT_ID)),
    ...sbAuthProps,
  };

  useEffect(() => {
    if (!isLoggedUser) {
      trackerRef.current.signOut();
    }
  }, [isLoggedUser]);

  return <Tracker {...widgetProps} ref={trackerRef} />;
};

const mapStateToProps = ({ loggedUserState, userState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState,
});

export default connect(mapStateToProps)(AccessTracker);
