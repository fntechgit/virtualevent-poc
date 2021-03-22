import {
  getAccessToken,
  getRequest,
  createAction,
  stopLoading,
  startLoading,  
} from 'openstack-uicore-foundation/lib/methods';

// import Swal from 'sweetalert2';

import { customErrorHandler } from '../utils/customErrorHandler';

import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

export const GET_EVENT_DATA         = 'GET_EVENT_DATA';
export const GET_EVENT_DATA_ERROR   = 'GET_EVENT_DATA_ERROR';

export const handleResetReducers = () => (dispatch) => {
  dispatch(createAction(LOGOUT_USER)({}));
}

export const getEventById = (eventId) => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
      access_token: accessToken,      
      expand: 'track,location,location.venue,location.floor,speakers,slides,links,videos,media_uploads'
  };

  dispatch(startLoading())

  return getRequest(
    null,
    createAction(GET_EVENT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/events/${eventId}/published`,
    customErrorHandler
  )(params)(dispatch).then(() => {
    dispatch(stopLoading());
  }).catch(e => {
    dispatch(stopLoading());
    dispatch(createAction(GET_EVENT_DATA_ERROR)(e));
    return (e);
  });
}