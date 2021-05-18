import React, {useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import { AttendeeToAttendeeContainer, Tracker } from 'attendee-to-attendee-widget'
import envVariables from '../utils/envVariables';
import withAccessToken from "../utils/withAccessToken";

import 'attendee-to-attendee-widget/dist/index.css'

const sbAuthProps = {
  supabaseUrl: envVariables.SUPABASE_URL,
  supabaseKey: envVariables.SUPABASE_KEY
};

const chatProps = {
  streamApiKey: envVariables.STREAM_IO_API_KEY,
  apiBaseUrl: envVariables.IDP_BASE_URL,
  chatApiBaseUrl: 'https://chat-api.dev.fnopen.com',
  forumSlug: envVariables.STREAM_IO_SSO_SLUG,
  onAuthError: (err, res) => console.log(err),
  openDir: "left",
  accessToken: null
};

export const AttendeesList = withAccessToken(({user, title, accessToken}) => {
  //const [accessInfo, setAccessInfo] = useState({});
  // const chatRef = useRef()

  const {email, first_name, last_name, bio} = user.userProfile
  const {picture, company, job_title, sub, github_user, linked_in_profile, twitter_name, wechat_user} = user.idpProfile
  
  chatProps.accessToken = accessToken;
  
  const widgetProps = {
    user: {
      id: sub.toString(),
      idpUserId: sub.toString(),
      fullName: `${first_name} ${last_name}`,
      email: email,
      company: company,
      title: job_title,
      picUrl: picture,
      socialInfo: {
        githubUser: github_user,	
        linkedInProfile: linked_in_profile,
        twitterName: twitter_name,
        wechatUser: wechat_user
      },
      badgeFeatures: ['feat 1', 'feat 2'], //attendee.ticket.badge.features
      bio: bio
    },
    summitId: parseInt(envVariables.SUMMIT_ID),
    height: 500,
    ...chatProps,
    ...sbAuthProps
  };

  //console.log('AttendeesList user', user)
  console.log('AttendeesList accessToken', accessToken)

  const getAccessToken = async () => {
    return accessToken
  }

  return (
    <div style={{margin: '20px auto', position: 'relative'}}>
        {/* {accessToken && <SimpleChat {...widgetProps} accessToken={accessToken} ref={chatRef} />} */}
        <AttendeeToAttendeeContainer {...widgetProps} title={title} getAccessToken={getAccessToken} />
    </div>
    );
})

const AccessTracker = ({user, isLoggedUser}) => {
  const trackerRef = useRef();

  const {email, first_name, last_name, bio} = user.userProfile
  const {picture, company, job_title, sub, github_user, linked_in_profile, twitter_name, wechat_user} = user.idpProfile
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
        wechatUser: wechat_user
      },
      badgeFeatures: ['feat 1', 'feat 2'], //attendee.ticket.badge.features
      bio: bio
    },
    summitId: parseInt(envVariables.SUMMIT_ID),
    ...sbAuthProps
  };

  useEffect(() => {
    if (!isLoggedUser) {
      trackerRef.current.signOut()
    }
  }, [isLoggedUser])

  return <Tracker {...widgetProps} ref={trackerRef} />
}

const mapStateToProps = ({ loggedUserState, userState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState
})

export default connect(mapStateToProps)(AccessTracker)