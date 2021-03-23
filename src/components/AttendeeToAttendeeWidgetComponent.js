import React, {useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import { RealTimeAttendeesList, SimpleChat, Tracker } from 'attendee-to-attendee-widget'
//import Swal from 'sweetalert2';
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
  forumSlug: envVariables.STREAM_IO_SSO_SLUG,
  onAuthError: (err, res) => console.log(err),
  openDir: "left"
};

export const AttendeesList = withAccessToken(({user, title, accessToken}) => {
  //const [accessInfo, setAccessInfo] = useState({});
  const chatRef = useRef()

  const handleItemClick = (itemInfo) => {
    //setAccessInfo(itemInfo)
    const attendee = itemInfo.attendees
    if (attendee.idp_user_id != user.idpProfile.sub) {
      chatRef.current.startOneToOneChat(`${attendee.idp_user_id}`)
    }

    // Swal.fire({
    //   title: 'Attendee info',
    //   text: `Full Name: ${attendee.full_name}<br/>email: ${attendee.email}<br/>IP Address: ${itemInfo.attendee_ip}<br/>Access Time<br/>${itemInfo.updated_at}<br/>`,
    //   showCancelButton: true,
    //   confirmButtonText: 'Start Chat',
    //   cancelButtonText: 'Close'
    // }).then((result) => {
    //   if (result.value && attendee.idp_user_id !== user.idpProfile.sub) {
    //     startOneToOneChat(`${attendee.idp_user_id}`)
    //   }
    // })
  }
  // const handleCTA = (itemInfo) => {
  //   console.log(itemInfo)
  // }

  return (
    <div style={{margin: '20px auto'}}>
        {accessToken && <SimpleChat {...chatProps} accessToken={accessToken} ref={chatRef} />}
        <RealTimeAttendeesList onItemClick={handleItemClick} {...sbAuthProps} title={title} summitId={parseInt(envVariables.SUMMIT_ID)} />
    </div>
    );
})

const AccessTracker = ({user, isLoggedUser}) => {
  const trackerRef = useRef();

  const {email, first_name, last_name} = user.userProfile
  const {picture, company, job_title, sub} = user.idpProfile
  const widgetProps = {
    user: {
      fullName: `${first_name} ${last_name}`,
      email: email,
      company: company,
      title: job_title,
      picUrl: picture,
      idpUserId: sub
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