import React, {useState} from 'react'
import { RealTimeAttendeesList, Tracker } from 'attendee-to-attendee-widget'
import 'attendee-to-attendee-widget/dist/index.css'
import Swal from 'sweetalert2';
//import envVariables from '../utils/envVariables';

// const sbAuthProps = {
//   supabaseUrl: envVariables.SUPABASE_URL,
//   supabaseKey: envVariables.SUPABASE_KEY
// };

const sbAuthProps = {
  supabaseUrl: process.env.GATSBY_SUPABASE_URL,
  supabaseKey: process.env.GATSBY_SUPABASE_KEY
};

export const AttendeesList = () => {
  //const [accessInfo, setAccessInfo] = useState({});

  const handleItemClick = (itemInfo) => {
    //setAccessInfo(itemInfo)
    const attendee = itemInfo.attendees
    Swal.fire("Attendee info", `Full Name: ${attendee.full_name}<br/>email: ${attendee.email}<br/>IP Address: ${itemInfo.attendee_ip}<br/>Access Time<br/>${itemInfo.updated_at}<br/>`);
    console.log(itemInfo)
  }

  const handleCTA = (itemInfo) => {
    console.log(itemInfo)
  }

  return (
    <div style={{margin: '20px auto'}}>
        <RealTimeAttendeesList onItemClick={handleItemClick} {...sbAuthProps} />
    </div>
    );
}

  export const AccessTracker = ({userProfile}) => {
    const {email, first_name, last_name, pic} = userProfile
    const widgetProps = {
      user: {
        fullName: `${first_name} ${last_name}`,
        email: email,
        picUrl: pic
      },
      summitId: parseInt(process.env.GATSBY_SUMMIT_ID),   //parseInt(envVariables.SUMMIT_ID)
      ...sbAuthProps
    };

    return <Tracker {...widgetProps} />
}