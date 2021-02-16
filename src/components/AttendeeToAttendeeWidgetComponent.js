import React from 'react'
import { RealTimeAttendeesList, Tracker } from 'attendee-to-attendee-widget'
import 'attendee-to-attendee-widget/dist/index.css'
//import Swal from 'sweetalert2';
import envVariables from '../utils/envVariables';

const sbAuthProps = {
  supabaseUrl: envVariables.SUPABASE_URL,
  supabaseKey: envVariables.SUPABASE_KEY
};

export const AttendeesList = ({onOneToOneChatClick, user, title}) => {
  //const [accessInfo, setAccessInfo] = useState({});

  const handleItemClick = (itemInfo) => {
    //setAccessInfo(itemInfo)
    const attendee = itemInfo.attendees
    if (onOneToOneChatClick && attendee.idp_user_id != user.idpProfile.sub) {
      onOneToOneChatClick(`${attendee.idp_user_id}`);
    }

    // Swal.fire({
    //   title: 'Attendee info',
    //   text: `Full Name: ${attendee.full_name}<br/>email: ${attendee.email}<br/>IP Address: ${itemInfo.attendee_ip}<br/>Access Time<br/>${itemInfo.updated_at}<br/>`,
    //   showCancelButton: true,
    //   confirmButtonText: 'Start Chat',
    //   cancelButtonText: 'Close'
    // }).then((result) => {
    //   if (result.value && onOneToOneChatClick && attendee.idp_user_id !== user.idpProfile.sub) {
    //     onOneToOneChatClick(`${attendee.idp_user_id}`);
    //   }
    // })
  }

  // const handleCTA = (itemInfo) => {
  //   console.log(itemInfo)
  // }

  return (
    <div style={{margin: '20px auto'}}>
        <RealTimeAttendeesList onItemClick={handleItemClick} {...sbAuthProps} title={title} summitId={parseInt(envVariables.SUMMIT_ID)} />
    </div>
    );
}

export const AccessTracker = ({user}) => {
  console.log('AccessTracker -> user', user)
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

  return <Tracker {...widgetProps} />
}